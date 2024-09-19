import os

from app import routes
from app.database import db, init_db
from flask import Flask


def create_app() -> Flask:
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    config_object = os.getenv("FLASK_CONFIG")
    app.config.from_object(config_object)

    # 開発環境時のみCORSを有効にする
    if config_object == "app.config.DevelopmentConfig":
        from flask_cors import CORS

        CORS(app)

    init_db(app)

    # a simple page that says hello
    @app.route("/")
    def hello_world():
        return "Hello World"

    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.session.remove()

    app.register_blueprint(routes.bp)

    return app
