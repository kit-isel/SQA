import pytest
from app.crud import read_question_with_answers_by_id
from app.database import db
from app.models import Answer, Question


@pytest.fixture
def insert_questions_and_answers():

    questions = [
        Question("title1", "description1"),
        Question("title2", "description2"),
        Question("タイトル1", "説明1"),
        Question("タイトル2", "説明2"),
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


class TestGetQuestionWithAnswersById:
    """
    有効なデータを送信した場合
    """

    # id == 1 と id == 3 の場合をテストする
    @pytest.mark.parametrize(
        ["id", "expected"],
        [
            (
                1,
                {
                    "title": "title1",
                    "description": "description1",
                    "answers": [{"description": "answer1"}, {"description": "answer2"}],
                },
            ),
            (
                3,
                {
                    "title": "タイトル1",
                    "description": "説明1",
                    "answers": [],
                },
            ),
        ],
    )
    def test_with_valid_data(
        self,
        client,
        init_db,
        insert_questions_and_answers,
        id: int,
        expected: dict,
    ):
        response = client.get(f"/questions/{id}")
        assert response.status_code == 200
        assert response.json.get("id") == id
        assert response.json.get("title") == expected["title"]
        assert response.json.get("description") == expected["description"]
        assert len(response.json.get("answers")) == len(expected["answers"])
        for i, answer in enumerate(response.json.get("answers")):
            assert answer.get("question_id") == id
            assert answer.get("description") == expected["answers"][i]["description"]

    """
    無効なデータを送信した場合
    """

    def test_when_db_is_empty(self, client, init_db):
        response = client.get("/questions/1")
        assert response.status_code == 404

    def test_with_no_question(self, client, init_db, insert_questions_and_answers):
        response = client.get("/questions/5")
        assert response.status_code == 404
