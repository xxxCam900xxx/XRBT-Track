# Ubuntu Image laden
FROM ubuntu:22.04

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install --no-cache-dir -r requirements.txt
RUN cd /app

EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]