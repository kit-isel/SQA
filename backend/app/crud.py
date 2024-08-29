from sqlalchemy import desc, func
from sqlalchemy.orm import Session
from app.models import Question, Answer
import sys


# questionを新規作成
def create_question(db: Session, title: str, description: str):
    question = Question(title, description)
    db.add(question)
    db.commit()
    db.refresh(question)
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
