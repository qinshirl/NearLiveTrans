FROM python:3.10-slim
WORKDIR /app
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt
# port 5000
EXPOSE 5002

CMD ["python", "translation_service.py"]
