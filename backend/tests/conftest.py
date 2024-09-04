import os

import pytest
from app import create_app
from app.database import db
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
    db.drop_all()
    db.create_all()
    db.session.commit()
    yield
