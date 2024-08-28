from sqlalchemy import desc
from sqlalchemy.orm import Session
import app.models as models

# questionを新規作成
def create_question(db: Session, title: str, description: str):
    question = models.Question(title, description)
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

# questionを全て取得
def read_questions():
    questions = models.Question.query.order_by(desc(models.Question.number_of_likes),
                                                desc(models.Question.created_at)).all()
    return questions

# 全てのquestionを削除
def delete_questions(db: Session):
    models.Question.query.delete()
    db.commit()
    models.Answer.query.delete()
    db.commit()

# answerを作成
def create_answer(db: Session, question_id: int, description: str):
    answer = models.Answer(question_id, description)
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

# 全てのanswerを取得（なければ0）
def read_answers():
    answers = models.Answer.query.all()
    return answers