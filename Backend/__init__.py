import os
import json
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)
    jwt.init_app(app)

    with app.app_context():
        @app.before_request
        def initialize_database():
            try:
                db.create_all()
            except Exception as e:
                print('> Error: DBMS Exception: ' + str(e))
                BASE_DIR = os.path.abspath(os.path.dirname(__file__))
                app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3')
                print('> Fallback to SQLite')
                db.create_all()

        @app.after_request
        def after_request(response):
            try:
                if response.status_code >= 400:
                    response_data = json.loads(response.get_data())
                    if "errors" in response_data:
                        response_data = {"success": False, "msg": list(response_data["errors"].items())[0][1]}
                        response.set_data(json.dumps(response_data))
                    response.headers.add('Content-Type', 'application/json')
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")

            return response

        from auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
