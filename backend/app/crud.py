import sys

from app.database import db
from app.models import Answer, Question
from sqlalchemy import func
from sqlalchemy.orm import Session


# questionを新規作成
def create_question(title: str, description: str) -> Question:
    question = Question(title, description)
    db.session.add(question)
    db.session.commit()
    db.session.refresh(question)
    return question


# questionを全て取得
def read_questions(session: Session):
    # subqueryの定義
    answer_counts = (
        session.query(
            Answer.question_id,
            func.count(Answer.id).label("answer_counts"),
        )
        .group_by(Answer.question_id)
        .subquery()
    )

    questions_with_counts = (
        session.query(
            Question.id,
            Question.title,
            Question.description,
            func.coalesce(answer_counts.c.answer_counts, 0).label("answer_counts"),
        )
        .outerjoin(answer_counts, Question.id == answer_counts.c.question_id)
        .all()
    )

    return questions_with_counts


# 全てのquestionを削除
def delete_questions(db: Session):
    Question.query.delete()
    db.commit()
    Answer.query.delete()
    db.commit()


# answerを作成
def create_answer(db: Session, question_id: int, description: str):
    answer = Answer(question_id, description)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer


# 全てのanswerを取得（なければ0）
def read_answers():
    answers = Answer.query.all()
    return answers
