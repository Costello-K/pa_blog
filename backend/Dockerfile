FROM python:3.11

ENV PYTHONUNBUFFERED=1

#assign a working directory
WORKDIR /blog/backend

RUN apt-get update -y && apt-get install netcat -y
RUN apt-get upgrade -y && apt-get install postgresql gcc python3-dev musl-dev -y

#install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /blog/requirements.txt
RUN pip install -r /blog/requirements.txt

#copy the project to the working directory
COPY .  /blog/backend

ENTRYPOINT sh -c /blog/backend/entrypoint.sh

EXPOSE 8000
