from __future__ import annotations

import glob
import os
from datetime import datetime

from airflow import DAG
from airflow.operators.python import ShortCircuitOperator
from airflow.providers.apache.spark.operators.spark_submit import SparkSubmitOperator


def _has_bronze(ds: str, **_kwargs) -> bool:
    date_path = ds.replace("-", "/")
    target_dir = f"/data/bronze/app/{date_path}"
    return bool(glob.glob(os.path.join(target_dir, "part-*.jsonl")))


with DAG(
    dag_id="growit_etl",
    description="Run Spark ETL from bronze JSONL to Delta Lake",
    start_date=datetime(2024, 1, 1),
    schedule_interval="0 * * * *",
    catchup=False,
    max_active_runs=1,
    tags=["growit"],
) as dag:
    check_bronze = ShortCircuitOperator(
        task_id="check_bronze",
        python_callable=_has_bronze,
    )

    run_spark = SparkSubmitOperator(
        task_id="spark_etl",
        application="/opt/airflow/spark/app/job_etl.py",
        conn_id="spark_default",
        spark_binary="/opt/spark/bin/spark-submit",
        packages="io.delta:delta-core_2.12:2.4.0",
        conf={
            "spark.sql.extensions": "io.delta.sql.DeltaSparkSessionExtension",
            "spark.sql.catalog.spark_catalog": "org.apache.spark.sql.delta.catalog.DeltaCatalog",
            "spark.jars.ivy": "/opt/airflow/tmp/.ivy2",
            "spark.eventLog.enabled": "true",
            "spark.eventLog.dir": "/opt/spark/spark-events",
        },
        application_args=[
            "--bronze",
            "/data/bronze/app/{{ ds|replace('-', '/') }}",
            "--delta",
            "/data/delta/events",
        ],
    )

    check_bronze >> run_spark
