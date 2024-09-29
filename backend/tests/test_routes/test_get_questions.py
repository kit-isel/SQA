import random
from datetime import datetime, timedelta

import pytest
from app.constants import PER_PAGE
from app.database import db
from app.models import Answer, Question

NUM_QUESTIONS = 100
DATE_OFFSET = datetime(2024, 1, 1)

QUESTION_PARAMS = [
    {
        "title": f"{i}番目の質問Title",
        "description": f"{i}番目の質問Description",
        "created_at": DATE_OFFSET + timedelta(days=i),
        "answers": [
            {"description": f"{j}番目の回答Description"}
            for j in range(1, random.randint(1, 5))
        ],
    }
    for i in range(1, NUM_QUESTIONS + 1)
]


@pytest.fixture
def insert_questions_and_answers():

    questions = [
        Question(params["title"], params["description"], params["created_at"])
        for params in QUESTION_PARAMS
    ]

    db.session.add_all(questions)
    db.session.commit()
    for q in questions:
        db.session.refresh(q)

    answers = [
        Answer(q.id, params["description"]) for q in questions for params in q.answers
    ]
    db.session.add_all(answers)
    db.session.commit()


@pytest.mark.usefixtures("init_db", "insert_questions_and_answers")
class TestGetQuestions:
    """
    有効なデータを送信した場合
        case1: 正常なリクエスト
        case2: sort=newest
        case3: sort=oldest
    """

    def test_with_valid_data(self, client):
        response = client.get("/questions")
        # レスポンスの確認
        assert response.status_code == 200
        assert len(response.json["questions"]) == PER_PAGE

        assert response.json["pagination"]["currentPage"] == 1
        assert (
            response.json["pagination"]["totalPages"]
            == (NUM_QUESTIONS - 1) // PER_PAGE + 1
        )

    def test_with_sort_newest(self, client):
        response = client.get("/questions?sort=newest")
        # レスポンスの確認
        assert response.status_code == 200

        assert len(response.json["questions"]) == PER_PAGE
        for i in range(PER_PAGE - 1):

            assert datetime.strptime(
                response.json["questions"][i]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            ) > datetime.strptime(
                response.json["questions"][i + 1]["createdAt"],
                "%a, %d %b %Y %H:%M:%S GMT",
            )

    def test_with_sort_oldest(self, client):
        response = client.get("/questions?sort=oldest")
        # レスポンスの確認
        assert response.status_code == 200

        assert len(response.json["questions"]) == PER_PAGE
        for i in range(PER_PAGE - 1):

            assert datetime.strptime(
                response.json["questions"][i]["createdAt"], "%a, %d %b %Y %H:%M:%S GMT"
            ) < datetime.strptime(
                response.json["questions"][i + 1]["createdAt"],
                "%a, %d %b %Y %H:%M:%S GMT",
            )

    """
    無効なデータを送信した場合
        case2: sortが不正な場合 (sortにはデフォルト値が設定される)
        case1: 存在しないページ番号を指定した場合
    """

    def test_with_invalid_sort_type(self, client):
        response = client.get("/questions?sort=invalid")
        # レスポンスの確認
        assert response.status_code == 200

    def test_with_invalid_page(self, client):
        response = client.get("/questions?page=100")
        # レスポンスの確認
        assert response.status_code == 404
        assert response.json.get("error") is not None
