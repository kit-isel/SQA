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


# questionをidで取得
def read_question_by_id(id: int):
    return Question.query.filter(
        Question.id == id,
        Question.deleted == False,
    ).first()


# answerと結合したquestionをidで取得
def read_question_with_answers_by_id(id: int) -> tuple[Question, list[Answer]]:
    # questionを取得
    question = Question.query.filter(
        Question.id == id,
        Question.deleted == False,
    ).first()
    if not question:
        return None, []
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
