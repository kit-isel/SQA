from sqlalchemy import Boolean, ForeignKey, Column, Integer, String
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp
from sqlalchemy.orm import relationship
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50))
    description = Column(String(240))
    number_of_likes = Column(Integer, default=0)
    status = Column(Boolean, default=False)
    created_at = Column(Timestamp)

    answers = relationship("Answer", back_populates="question")

    def __init__(self, title, description):
        self.title = title
        self.description = description

class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    description = Column(String(240))
    status = Column(Boolean, default=False)
    created_at = Column(Timestamp)

    question = relationship("Question", back_populates="answers")

    def __init__(self, question_id, description):
        self.question_id = question_id
        self.description = description