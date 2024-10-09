from app.constants import MAX_TITLE_LENGTH
from app.database import db
from flask import current_app
from sqlalchemy import TEXT as Text
from sqlalchemy import VARCHAR as Varchar
from sqlalchemy import Boolean, Column, ForeignKey, Integer, func
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.functions import current_timestamp


class Question(db.Model):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Varchar(MAX_TITLE_LENGTH))
    description = Column(Text)
    status = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(Timestamp, default=current_timestamp())
    answers = db.relationship("Answer", backref="question")

    def __init__(self, title, description, created_at=None):
        self.title = title
        self.description = description
        if created_at:
            self.created_at = created_at

    @hybrid_property
    def answer_counts(self):
        return len(self.answers)

    @answer_counts.expression
    def answer_counts(cls):
        return (
            db.session.query(func.count(Answer.id))
            .filter(Answer.question_id == cls.id)
            .label("answer_counts")
        )

    def to_dict(self):
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        } | {
            "answers": [answer.to_dict() for answer in self.answers],
            "answerCounts": self.answer_counts,
        }

    def to_limited_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "createdAt": self.created_at,
            "answers": [answer.to_limited_dict() for answer in self.answers],
            "answerCounts": self.answer_counts,
        }


class Answer(db.Model):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    description = Column(Text)
    is_best = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(Timestamp, default=current_timestamp())

    def __init__(self, question_id, description):
        self.question_id = question_id
        self.description = description

    def to_dict(self):
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }

    def to_limited_dict(self):
        return {
            "id": self.id,
            "questionId": self.question_id,
            "description": self.description,
            "isBest": self.is_best,
            "createdAt": self.created_at,
        }
