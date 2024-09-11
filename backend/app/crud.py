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
def read_questions(sort_type: SortType) -> list[Question]:
    questions = (
        Question.query.filter(
            Question.deleted == False,
        )
        .order_by(
            Question.created_at.desc()
            if sort_type == SortType.NEWEST
            else Question.created_at.asc()
        )
        .all()
    )
    return questions


# questionをidで取得
def read_question_by_id(id: int) -> Question:
    return Question.query.filter(
        Question.id == id,
        Question.deleted == False,
    ).first()


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
