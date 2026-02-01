FROM apache/airflow:2.7.3

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends openjdk-11-jre-headless curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV SPARK_VERSION=3.4.1
ENV HADOOP_VERSION=3
RUN curl -fsSL https://archive.apache.org/dist/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION}.tgz \
    | tar -xz -C /opt \
    && mv /opt/spark-${SPARK_VERSION}-bin-hadoop${HADOOP_VERSION} /opt/spark

ENV SPARK_HOME=/opt/spark
ENV PATH="${SPARK_HOME}/bin:${PATH}"

COPY --chown=airflow:0 requirements.txt /requirements.txt

USER airflow
RUN pip install --no-cache-dir -r /requirements.txt
