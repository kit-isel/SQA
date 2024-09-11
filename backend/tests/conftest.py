import os

import pytest
from app import create_app
from app.database import db
from app.models import Answer, Question
from flask import Flask
from flask.testing import FlaskClient


@pytest.fixture
def app():
    os.environ["FLASK_CONFIG"] = "app.config.TestingConfig"
    app = create_app()

    with app.app_context():
        yield app


@pytest.fixture
def client(app: Flask) -> FlaskClient:
    return app.test_client()


@pytest.fixture
def init_db(app: Flask):
    with app.app_context():
        db.create_all()
        db.session.begin_nested()
        yield

        db.session.close()
        db.drop_all()
