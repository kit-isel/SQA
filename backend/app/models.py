from app.database import db
from sqlalchemy import TEXT as Text
from sqlalchemy import VARCHAR as Varchar
from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.functions import current_timestamp

TITLE_LENGTH = 255


class Question(db.Model):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Varchar(TITLE_LENGTH))
    description = Column(Text)
    status = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(Timestamp, default=current_timestamp())

    def __init__(self, title, description, created_at=None):
        self.title = title
        self.description = description
        if created_at:
            self.created_at = created_at


class Answer(db.Model):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    description = Column(Text)
    is_best = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(Timestamp)

    def __init__(self, question_id, description):
        self.question_id = question_id
        self.description = description
