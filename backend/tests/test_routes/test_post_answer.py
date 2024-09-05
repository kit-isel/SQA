import pytest
from app.database import db
from app.models import Answer
from flask.testing import FlaskClient


@pytest.fixture
def insert_question():
    from app.models import Question

    question1 = Question("title1", "description1")
    question2 = Question("title2", "description2")
    question3 = Question("タイトル1", "説明1")
    question4 = Question("タイトル2", "説明2")
    db.session.add(question1)
    db.session.add(question2)
    db.session.add(question3)
    db.session.add(question4)
    db.session.commit()


class TestPostAnswer:
    """
    有効なデータを送信した場合
    """

    @pytest.mark.parametrize(
        "data",
        [
            {"question_id": 1, "description": "description1"},
            {"question_id": 2, "description": "description2"},
            {"question_id": 3, "description": "説明1"},
            {"question_id": 4, "description": "説明2"},
        ],
    )
    def test_with_valid_data(self, client, init_db, insert_question, data):
        response = client.post(
            f"/questions/{data['question_id']}/answer",
            json={"description": data["description"]},
        )
        # レスポンスの確認
        assert response.status_code == 201
        assert response.json.get("id") is not None
        assert response.json.get("question_id") == data["question_id"]
        assert response.json.get("description") == data["description"]
        # データベースの確認
        answers = db.session.query(Answer).all()
        assert len(answers) == 1
        assert answers[0].question_id == data["question_id"]
        assert answers[0].description == data["description"]

    """
    無効なデータを送信した場合
    """

    def test_with_no_data(self, client: FlaskClient, init_db):
        response = client.post("/questions/1/answer")
        assert response.status_code == 415

    def test_with_no_description(self, client: FlaskClient, init_db):
        response = client.post("/questions/1/answer", json={})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_no_question_id(self, client: FlaskClient, init_db):
        response = client.post("/questions/answer", json={"description": "description"})
        assert response.status_code == 404

    def test_with_invalid_question_id(
        self, client: FlaskClient, init_db, insert_question
    ):
        response = client.post(
            "/questions/100/answer", json={"description": "description"}
        )
        assert response.status_code == 404
        assert response.json.get("error") is not None
