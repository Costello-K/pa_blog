FROM python:3.11

ENV PYTHONUNBUFFERED=1

#assign a working directory
WORKDIR /blog/backend

#install dependencies
COPY ./requirements.txt /blog/requirements.txt
RUN pip install -r /blog/requirements.txt

#copy the project to the working directory
COPY .  /blog/backend

RUN chmod o+x /blog/backend/prestart.sh

ENTRYPOINT sh -c /blog/backend/prestart.sh

EXPOSE 8000
