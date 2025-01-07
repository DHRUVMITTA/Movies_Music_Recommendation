import os, random, string
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', "4a8f3111fb4a9de6a6d050dd2b6ef98e")
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', "6e28caa57d357b406928398c14eac9a4fb7fc13dbfc61a764843dd6367a355f8")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=30)
    JWT_COOKIE_SECURE=True
    JWT_COOKIE_CSRF_PROTECT=True
    JWT_TOKEN_LOCATION=['cookies']
    JWT_ACCESS_COOKIE_PATH= '/'
    JWT_REFRESH_COOKIE_PATH='/refresh'
    DB_ENGINE = 'mysql'
    DB_USERNAME = "root"
    DB_PASS = ""
    DB_HOST = "localhost"
    DB_PORT = "3306"
    DB_NAME = "flask"
    DB_CURSORCLASS = 'DictCursor'
    USE_SQLITE = True 

    if DB_ENGINE and DB_NAME and DB_USERNAME:
        try:
            SQLALCHEMY_DATABASE_URI = '{}://{}:{}@{}:{}/{}'.format(
                DB_ENGINE,
                DB_USERNAME,
                DB_PASS,
                DB_HOST,
                DB_PORT,
                DB_NAME
            )
            USE_SQLITE = False
        except Exception as e:
            print('> Error: DBMS Exception: ' + str(e))
            print('> Fallback to SQLite')

    if USE_SQLITE:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
