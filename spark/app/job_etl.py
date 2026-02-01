import argparse
from datetime import datetime

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_date


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Growit Spark ETL")
    parser.add_argument("--bronze", required=True)
    parser.add_argument("--delta", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    spark = (
        SparkSession.builder.appName("growit-etl")
        .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
        .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
        .getOrCreate()
    )

    input_path = args.bronze
    df = spark.read.json(input_path)

    df = df.withColumn("event_date", to_date(col("received_at")))

    df = df.dropDuplicates(["event_id"])

    (
        df.write.format("delta")
        .mode("append")
        .partitionBy("event_date")
        .save(args.delta)
    )

    spark.stop()


if __name__ == "__main__":
    main()
