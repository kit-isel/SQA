FROM --platform=linux/arm64 python:3.9.19

WORKDIR /app
COPY ./requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["flask", "--debug", "run", "--host", "0.0.0.0"]