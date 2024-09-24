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


"""
QuestionのCRUD操作を行う関数を定義
"""


# questionを新規作成
def create_question(title: str, description: str) -> Question:
    question = Question(title, description)
    db.session.add(question)
    db.session.commit()
    db.session.refresh(question)
    return question


# questionを全て取得
def read_questions(
    sort_type: SortType, include_deleted: bool = False
) -> list[Question]:
    query = Question.query
    if not include_deleted:
        query = query.filter(Question.deleted == False)
    match sort_type:
        case SortType.NEWEST:
            query = query.order_by(Question.created_at.desc())
        case SortType.OLDEST:
            query = query.order_by(Question.created_at.asc())
    return query.all()


# questionをidで取得
def read_question_by_id(id: int, include_deleted: bool = False) -> Question:
    query = Question.query.filter(Question.id == id)
    if not include_deleted:
        query = query.filter(Question.deleted == False)
    return query.first()


# questionを更新
def update_question(question: Question) -> Question:
    db.session.add(question)
    db.session.commit()
    db.session.refresh(question)
    return question


# 全てのquestionを削除
def delete_questions(db: Session):
    Question.query.delete()
    db.commit()
    Answer.query.delete()
    db.commit()


# questionをidで削除
def delete_question_by_id(id: int):
    Question.query.filter(Question.id == id).delete()
    db.session.commit()
    return None


"""
AnswerのCRUD操作を行う関数を定義
"""


# answerを作成
def create_answer(question_id: int, description: str):
    answer = Answer(question_id, description)
    db.session.add(answer)
    db.session.commit()
    db.session.refresh(answer)
    return answer


# answerを全て取得
def read_answers(sort_type: SortType, include_deleted: bool = False) -> list[Answer]:
    query = Answer.query
    if not include_deleted:
        query = query.filter(Answer.deleted == False)
    match sort_type:
        case SortType.NEWEST:
            query = query.order_by(Answer.created_at.desc())
        case SortType.OLDEST:
            query = query.order_by(Answer.created_at.asc())
    return query.all()


# answerをidで取得
def read_answer_by_id(id: int, include_deleted: bool = False) -> Answer:
    query = Answer.query.filter(Answer.id == id)
    if not include_deleted:
        query = query.filter(Answer.deleted == False)
    return query.first()


# answerを更新
def update_answer(answer: Answer) -> Answer:
    db.session.add(answer)
    db.session.commit()
    db.session.refresh(answer)
    return answer


# 全てのanswerを削除
def delete_answers(db: Session):
    Answer.query.delete()
    db.commit()


# answerをidで削除
def delete_answer_by_id(id: int):
    Answer.query.filter(Answer.id == id).delete()
    db.session.commit()
    return None
