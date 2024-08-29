from sqlalchemy import (
    Boolean,
    ForeignKey,
    Column,
    Integer,
    VARCHAR as Varchar,
    TEXT as Text,
)
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.sql.functions import current_timestamp
from sqlalchemy.orm import relationship
from app.database import Base

TITLE_LENGTH = 255


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Varchar(TITLE_LENGTH))
    description = Column(Text)
    status = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)
    created_at = Column(Timestamp, default=current_timestamp())

    def __init__(self, title, description):
        self.title = title
        self.description = description


class Answer(Base):
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
