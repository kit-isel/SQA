import pytest
from app.database import db
from app.models import Question
from flask.testing import FlaskClient


class TestPostAsk:
    """
    有効なデータを送信した場合
    """

    @pytest.mark.parametrize(
        "data",
        [
            {"title": "title1", "description": "description1"},
            {"title": "title2", "description": "description2"},
            {"title": "タイトル1", "description": "説明1"},
            {"title": "タイトル2", "description": "説明2"},
        ],
    )
    def test_with_valid_data(self, client: FlaskClient, init_db, data):
        response = client.post("/questions/ask", json=data)
        # レスポンスの確認
        assert response.status_code == 201
        assert response.json.get("id") is not None
        assert response.json.get("title") == data["title"]
        assert response.json.get("description") == data["description"]
        # データベースの確認
        questions = db.session.query(Question).all()
        assert len(questions) == 1
        assert questions[0].title == data["title"]
        assert questions[0].description == data["description"]

    """
    無効なデータを送信した場合
        case1: jsonデータがない場合
        case2: titleがない場合
        case3: descriptionがない場合
    """

    def test_with_no_data(self, client: FlaskClient, init_db):
        response = client.post("/questions/ask")
        assert response.status_code == 415

    def test_with_no_title(self, client: FlaskClient, init_db):
        response = client.post("/questions/ask", json={"description": "description"})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_no_description(self, client: FlaskClient, init_db):
        response = client.post("/questions/ask", json={"title": "title"})
        assert response.status_code == 400
        assert response.json.get("error") is not None
