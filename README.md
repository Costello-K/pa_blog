Описание проекта:
Блог 

Инструменты разработки
Стек:

Python >= 3.11
Django == 3.2.4
postgres
Разработка
1) Docker

2) Клонировать репозиторий

[//]: # (git clone https://github.com/blog.git)
3) Создать виртуальное окружение
cd blog

python -m venv venv
4) Активировать виртуальное окружение
Linux

source venv/bin/activate
Windows

./venv/Scripts/activate
5) Устанавливить зависимости:
pip install -r requrements.txt
6) Выполнить команду для выполнения миграций
python manage.py migrate
8) Создать суперпользователя
python manage.py createsuperuser
9) Запустить сервер
python manage.py runserver
10) Ссылки
Сайт http://127.0.0.1:8000/

Админ панель http://127.0.0.1:8000/admin

Copyright (c) 2023-present, Kostiantyn Kondratenko
