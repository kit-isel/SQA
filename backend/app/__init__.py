import os
from flask import Flask

from app.database import init_db
from app.database import db_session
from app import routes

def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py', silent=True)

    init_db()

    # a simple page that says hello
    @app.route('/')
    def hello_world():
        return "Hello World"

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    app.register_blueprint(routes.bp)

    return app