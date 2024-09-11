from datetime import datetime

import pytest
from app.database import db
from app.models import Answer, Question


@pytest.fixture
def insert_questions_and_answers():
    questions = [
        Question("title1", "description1", created_at="2021-01-01 00:00:00"),
        Question("title2", "description2", created_at="2021-01-02 00:00:00"),
        Question("タイトル1", "説明1", created_at="2021-01-03 00:00:00"),
        Question("タイトル2", "説明2", created_at="2021-01-04 00:00:00"),
    ]

    answers = [
        Answer(1, "answer1"),
        Answer(1, "answer2"),
        Answer(2, "回答3"),
        Answer(2, "回答4"),
    ]

    db.session.add_all(questions)
    db.session.commit()
    db.session.add_all(answers)
    db.session.commit()


@pytest.mark.usefixtures("init_db", "insert_questions_and_answers")
class TestGetQuestions:
    """
    有効なデータを送信した場合
    """

    def test_with_valid_data(self, client):
        response = client.get("/questions")
        # レスポンスの確認
        assert response.status_code == 200
        assert len(response.json) == 4

    def test_with_sort_newest(self, client):
        response = client.get("/questions?sort=newest")
        # レスポンスの確認
        assert response.status_code == 200

        assert len(response.json) == 4
        for i in range(3):

            assert datetime.strptime(
                response.json[i]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            ) > datetime.strptime(
                response.json[i + 1]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            )

    def test_with_sort_oldest(self, client):
        response = client.get("/questions?sort=oldest")
        # レスポンスの確認
        assert response.status_code == 200
        assert len(response.json) == 4
        for i in range(3):
            assert datetime.strptime(
                response.json[i]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            ) < datetime.strptime(
                response.json[i + 1]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            )

    """
    無効なデータを送信した場合
    """

    def test_with_invalid_sort_type(self, client):
        response = client.get("/questions?sort=invalid")
        # レスポンスの確認
        assert response.status_code == 400
        assert response.json.get("error") is not None
