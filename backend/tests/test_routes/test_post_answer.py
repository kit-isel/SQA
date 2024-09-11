import random

import pytest
from app.constants import DESCRIPTION_MAX_LENGTH
from app.database import db
from app.models import Answer, Question
from flask.testing import FlaskClient


@pytest.fixture
def insert_question():

    questions = [
        Question("title1", "description1"),
        Question("title2", "description2"),
        Question("タイトル1", "説明1"),
        Question("タイトル2", "説明2"),
    ]
    db.session.add_all(questions)
    db.session.commit()


@pytest.mark.usefixtures("init_db", "insert_question")
class TestPostAnswer:
    """
    有効なデータを送信した場合
        case1: 通常のデータを送信した場合
        case2: descriptionが最大文字数の場合
    """

    def test_with_valid_data(self, client: FlaskClient):
        # テストデータの定義
        data_size = 30
        data = [
            {"questionId": i % 4 + 1, "description": f"description{i}"}
            for i in range(1, data_size + 1)
        ]

        for i in range(data_size):
            # リクエストの送信
            response = client.post(
                f"/questions/{data[i]["questionId"]}/answers", json={"description": data[i]["description"]}
            )
            # レスポンスの確認
            assert response.status_code == 201
            assert response.json.get("id") is not None
            assert response.json.get("questionId") == data[i]["questionId"]
            assert response.json.get("description") == data[i]["description"]

        # データベースの確認
        answers = db.session.query(Answer).all()
        assert len(answers) == data_size
        for i in range(data_size):
            assert answers[i].question_id == data[i]["questionId"]
            assert answers[i].description == data[i]["description"]

    def test_with_valid_long_data(self, client: FlaskClient):
        # テストデータの定義
        data_size = 30
        data = [
            {
                "questionId": i % 4 + 1,
                "description": f"a" * DESCRIPTION_MAX_LENGTH,
            }
            for i in range(data_size)
        ]
        for i in range(data_size):
            # リクエストの送信
            response = client.post(
                f"/questions/{data[i]['questionId']}/answers", json={"description": data[i]["description"]}
            )
            # レスポンスの確認
            assert response.status_code == 201
            assert response.json.get("id") is not None
            assert response.json.get("questionId") == data[i]["questionId"]
            assert response.json.get("description") == data[i]["description"]
        # データベースの確認
        answers = db.session.query(Answer).all()
        assert len(answers) == data_size
        for i in range(data_size):
            assert answers[i].question_id == data[i]["questionId"]
            assert answers[i].description == data[i]["description"]

    """
    無効なデータを送信した場合
        case1: jsonデータがない場合
        case2: descriptionがない場合
        case3: question_idがない場合
        case4: question_idが不正な場合
        case5: descriptionの文字数が0の場合
        case6: descriptionの文字数が最大文字数を超えた場合
    """

    def test_with_no_data(self, client: FlaskClient):
        response = client.post("/questions/1/answers")
        assert response.status_code == 415

    def test_with_no_description(self, client: FlaskClient):
        response = client.post("/questions/1/answers", json={})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_no_question_id(self, client: FlaskClient):
        response = client.post(
            "/questions/answers", json={"description": "description"}
        )
        assert response.status_code == 404

    def test_with_invalid_question_id(self, client: FlaskClient):
        response = client.post(
            "/questions/100/answers", json={"description": "description"}
        )
        assert response.status_code == 404
        assert response.json.get("error") is not None

    def test_with_empty_description(self, client: FlaskClient):
        response = client.post("/questions/1/answers", json={"description": ""})
        assert response.status_code == 400
        assert response.json.get("error") is not None

    def test_with_long_description(self, client: FlaskClient):
        response = client.post(
            "/questions/1/answers",
            json={"description": f"a" * (DESCRIPTION_MAX_LENGTH + 1)},
        )
        assert response.status_code == 400
        assert response.json.get("error") is not None
