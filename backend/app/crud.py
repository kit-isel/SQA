import sys
from enum import StrEnum, auto
from typing import Self

from app.database import db
from app.models import Answer, Question
from sqlalchemy import func
from sqlalchemy.orm import Session


class SortType(StrEnum):
    NEWEST = auto()
    OLDEST = auto()

    @classmethod
    def default(cls):
        return cls.NEWEST

    @classmethod
    def from_str(cls, s: str) -> Self:
        if s.upper() in cls.__members__:
            return cls[s.upper()]
        raise ValueError(f"invalid sort type: {s}")


# questionを新規作成
def create_question(title: str, description: str) -> Question:
    question = Question(title, description)
    db.session.add(question)
    db.session.commit()
    db.session.refresh(question)
    return question


# questionを全て取得
def read_questions_with_answer_counts(sort_type: SortType) -> dict[str, any]:
    # subqueryの定義
    answer_counts = (
        Answer.query.with_entities(
            Answer.question_id, func.count(Answer.id).label("answer_counts")
        )
        .group_by(Answer.question_id)
        .subquery()
    )

    # questionとanswer_countsを結合
    questions_with_answer_counts = (
        Question.query.with_entities(
            Question,
            func.coalesce(answer_counts.c.answer_counts, 0).label("answer_counts"),
        )
        .outerjoin(answer_counts, Question.id == answer_counts.c.question_id)
        .filter(Question.deleted == False)
        .order_by(
            Question.created_at.desc()
            if sort_type == SortType.NEWEST
            else Question.created_at.asc()
        )
        .all()
    )
    db.session.commit()
    return [
        question.to_dict() | {"answer_counts": answer_counts}
        for question, answer_counts in questions_with_answer_counts
    ]


# questionをidで取得
def read_question_by_id(id: int):
    return Question.query.filter(
        Question.id == id,
        Question.deleted == False,
    ).first()


# answerと結合したquestionをidで取得
def read_question_with_answers_by_id(id: int) -> tuple[Question, list[Answer]] | None:
    # questionを取得
    question = Question.query.filter(
        Question.id == id,
        Question.deleted == False,
    ).first()
    if not question:
        return None
    # answerのlistを取得
    answers = Answer.query.filter(
        Answer.question_id == id,
        Answer.deleted == False,
    ).all()
    return question, answers


# 全てのquestionを削除
def delete_questions(db: Session):
    Question.query.delete()
    db.commit()
    Answer.query.delete()
    db.commit()


# answerを作成
def create_answer(question_id: int, description: str):
    answer = Answer(question_id, description)
    db.session.add(answer)
    db.session.commit()
    db.session.refresh(answer)
    return answer


# 全てのanswerを取得（なければ0）
def read_answers():
    answers = Answer.query.all()
    return answers
