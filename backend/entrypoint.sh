#!/bin/sh

python manage.py makemigrations --no-input

python manage.py migrate --no-input

python manage.py createsuperuser --no-input

python manage.py runserver 0.0.0.0:8000

#if [ "$DATABASE" = "postgres" ]
#then
#    echo "Waiting for postgres..."
#
#    while ! nc -z $PSQL_HOST P$SQL_PORT; do
#      sleep 0.1
#    done
#
#    echo "PostgreSQL started"
#fi

#python manage.py flush --no-input
#python manage.py makemigrations
#python manage.py migrate
#python manage.py createsuperuser --no-input

#exec "$@"
