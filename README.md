Project name:
Blog

Project description:

This project is a web application for writing posts. The application allows users to create, edit and delete their own posts, view and comment on other people's published posts, put likes and dislikes. Also implemented is the ability to work with the user account settings. It uses Django REST Framework (DRF) as the API and React as the frontend.

Development Tools:

    Python >= 3.10
    
    Django == 4.1.5
    Django REST Framework 3.12.2
    
    PostgreSQL
    
    Node 12.16.1
    React 16.13.1
    Redux 4.2.1
    
    Docker 20.10.2

Installation and running the project:

1) Clone the repository

       https://github.com/Costello90/pa_blog.git
2) Create a virtual environment

       cd blog
       python -m venv venv

3) Activate virtual environment

   Linux

       source venv/bin/activate

   Windows

       ./venv/Scripts/activate
4) Install dependencies:

       pip install -r requrements.txt
5) Set up PostgreSQL DB with your credentials or use default Django DB (SQLite3).
6) Create .env file in the 'blog/backend' directory with the following constants:

       SECRET_KEY=django-insecure-y%a54y456bm(srhrtyzeu)k20%s9fdFk)oonvlc9egwip3g@h+nb)=
       DEBUG=1
       DJANGO_ALLOWED_HOSTS=127.0.0.1
       FRONTEND_HOST_PORT=127.0.0.1:3000
       DATABASE=postgres
       PSQL_DB=blog
       PSQL_ENGINE=django.db.backends.postgresql_psycopg2
       PSQL_NAME=blog
       PSQL_USER=postgres
       PSQL_PASSWORD=password12345
       PSQL_HOST=localhost
       PSQL_PORT=5432
       DJANGO_SUPERUSER_USERNAME=admin@gmail.com
       DJANGO_SUPERUSER_EMAIL=admin@gmail.com
       DJANGO_SUPERUSER_PASSWORD=adminpassword12345
    The following constants are required to activate an account by email and reset the password. Enter your details

       EMAIL_HOST_USER=********@gmail.com
       EMAIL_HOST_PASSWORD=*************
       DEFAULT_FROM_EMAIL=********@gmail.com
7) Create migrations and apply them to the database

       python manage.py makemigrations
       python manage.py migrate
8) Create superuser

       python manage.py createsuperuser
9) Run server

       python manage.py runserver
10) Links

    DRF API 

        http://127.0.0.1:8000/

    Django admin interface 

        http://127.0.0.1:8000/admin

11) Open another terminal. Navigate to the project's frontend directory:

        cd frontend
12) Install dependencies:

        npm install
13) Start the frontend server:

        npm start
14) You can now open a web browser and see the application in action at the following address. For cookies to work correctly, use 127.0.0.1 instead of localhost
       
        http://127.0.0.1:3000

Deploying the application using Docker:

1) Ensure that Docker and Docker Compose are installed on your system.

2) For the server to work, you need to create a .env file in the 'blog/backend' directory with the following constants:

       SECRET_KEY=django-insecure-y%a54y456bm(srhrtyzeu)k20%s9fdFk)oonvlc9egwip3g@h+nb)=
       DEBUG=1
       DJANGO_ALLOWED_HOSTS=127.0.0.1
       FRONTEND_HOST_PORT=127.0.0.1:4001
       DATABASE=postgres
       PSQL_DB=blog
       PSQL_ENGINE=django.db.backends.postgresql_psycopg2
       PSQL_NAME=blog
       PSQL_USER=postgres
       PSQL_PASSWORD=password12345
       PSQL_HOST=blog_db
       PSQL_PORT=5432
       DJANGO_SUPERUSER_USERNAME=admin@gmail.com
       DJANGO_SUPERUSER_EMAIL=admin@gmail.com
       DJANGO_SUPERUSER_PASSWORD=erthry54GFGkgfhy56hd
    The following constants are required to activate an account by email and reset the password. Enter your details

       EMAIL_HOST_USER=********@gmail.com
       EMAIL_HOST_PASSWORD=*************
       DEFAULT_FROM_EMAIL=********@gmail.com

    For the Docker to work, you need to create a .env file in the 'blog' directory with the following constants:

       PSQL_DB=blog
       PSQL_USER=postgres
       PSQL_PASSWORD=password12345
       PSQL_HOST=blog_db

3) Build the Docker images:

       docker-compose build
4) Start the containers:

       docker-compose up
5) You can now open a web browser and see the application in action at the following address. For cookies to work correctly, use 127.0.0.1 instead of localhost
       
       http://127.0.0.1:4001

License:

Copyright (c) 2023-present, Kostiantyn Kondratenko
