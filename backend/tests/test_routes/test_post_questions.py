import pytest
from app.constants import MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH
from app.database import db
from app.models import Question
from flask import current_app
from flask.testing import FlaskClient


@pytest.mark.usefixtures("init_db")
class TestPostAsk:
    """
    有効なデータを送信した場合
        case1: 通常のデータを送信した場合
        case2: titleとdescriptionが最大文字数の場合
    """

    def test_with_valid_data(self, client: FlaskClient):
        # テストデータの定義
        data_size = 30
        data = [
            {"title": f"title{i}", "description": f"description{i}"}
            for i in range(1, data_size + 1)
        ]

        for i in range(data_size):
            # リクエストの送信
            response = client.post("/questions", json=data[i])
            # レスポンスの確認
            assert response.status_code == 201
            assert response.json.get("id") is not None
            assert response.json.get("title") == data[i]["title"]
            assert response.json.get("description") == data[i]["description"]
        # データベースの確認
        questions = db.session.query(Question).all()
        assert len(questions) == data_size
        for i in range(data_size):
            assert questions[i].title == data[i]["title"]
            assert questions[i].description == data[i]["description"]

    def test_with_valid_long_data(self, client: FlaskClient):
        # テストデータの定義
        data_size = 30
        data = [
            {
                "title": f"a" * MAX_TITLE_LENGTH,
                "description": f"a" * MAX_DESCRIPTION_LENGTH,
            }
            for i in range(data_size)
        ]
        for i in range(data_size):
            # リクエストの送信
            response = client.post("/questions", json=data[i])
            # レスポンスの確認
            assert response.status_code == 201
            assert response.json.get("id") is not None
            assert response.json.get("title") == data[i]["title"]
            assert response.json.get("description") == data[i]["description"]
        # データベースの確認
        questions = db.session.query(Question).all()
        assert len(questions) == data_size
        for i in range(data_size):
            assert questions[i].title == data[i]["title"]
            assert questions[i].description == data[i]["description"]

    """
    無効なデータを送信した場合
        case1: jsonデータがない場合
        case2: titleがない場合
        case3: descriptionがない場合
        case4: titleの文字数が0の場合
        case5: descriptionの文字数が0の場合
        case6: titleの文字数が上限以上の場合
        case7: descriptionの文字数が上限以上の場合
    """

    def test_with_no_data(self, client: FlaskClient):
        response = client.post("/questions")
        assert response.status_code == 415

    def test_with_no_title(self, client: FlaskClient):
        response = client.post("/questions", json={"description": "description"})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_no_description(self, client: FlaskClient):
        response = client.post("/questions", json={"title": "title"})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_empty_title(self, client: FlaskClient):
        response = client.post(
            "/questions", json={"title": "", "description": "description"}
        )
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_empty_description(self, client: FlaskClient):
        response = client.post("/questions", json={"title": "title", "description": ""})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_invalied_long_title(self, client: FlaskClient):
        response = client.post(
            "/questions",
            json={
                "title": "a" * (MAX_TITLE_LENGTH + 1),
                "description": "description",
            },
        )
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_invalied_long_description(self, client: FlaskClient):
        response = client.post(
            "/questions",
            json={
                "title": "title",
                "description": "a" * (MAX_DESCRIPTION_LENGTH + 1),
            },
        )
        assert response.status_code == 400
        assert response.json.get("error") is not None
