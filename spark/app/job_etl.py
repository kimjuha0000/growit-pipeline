import argparse

from pyspark.sql import SparkSession
from pyspark.sql import DataFrame
from pyspark.sql.column import Column
from pyspark.sql.functions import coalesce, col, lit, to_date, to_json


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Growit Spark ETL")
    parser.add_argument("--bronze", required=True)
    parser.add_argument("--delta", required=True)
    return parser.parse_args()


def _string_col(df: DataFrame, name: str) -> Column:
    if name in df.columns:
        return col(name).cast("string")
    return lit(None).cast("string")


def _int_col(df: DataFrame, name: str) -> Column:
    if name in df.columns:
        return col(name).cast("int")
    return lit(None).cast("int")


def main() -> None:
    args = parse_args()

    spark = (
        SparkSession.builder.appName("growit-etl")
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
        .getOrCreate()
    )

    df = spark.read.json(args.bronze)

    # Normalize bronze payload into a stable schema.
    received_at_col = _string_col(df, "received_at")
    metadata_json_col = _string_col(df, "metadata_json")
    legacy_metadata_col = to_json(col("metadata")) if "metadata" in df.columns else lit(None).cast("string")

    df = df.select(
        _string_col(df, "anonymous_id").alias("anonymous_id"),
        _string_col(df, "event_id").alias("event_id"),
        _string_col(df, "event_type").alias("event_type"),
        received_at_col.alias("received_at"),
        _string_col(df, "user_id").alias("user_id"),
        coalesce(_int_col(df, "event_version"), lit(1)).alias("event_version"),
        coalesce(metadata_json_col, legacy_metadata_col).alias("metadata_json"),
        to_date(received_at_col).alias("event_date"),
    )

    df = df.filter(col("event_id").isNotNull()).dropDuplicates(["event_id"])

    (
        df.write.format("delta")
        .option("mergeSchema", "true")
        .mode("append")
        .partitionBy("event_date")
        .save(args.delta)
    )

    spark.stop()


if __name__ == "__main__":
    main()
