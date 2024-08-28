from flask import Blueprint, request

from app.database import db_session
from app import crud

bp = Blueprint("routes", __name__)

@bp.route("/ask", methods=["POST"])
def ask_question():
    title = request.json.get("title")
    description = request.json.get("description")
    if not title or not description:
        return {"error": "title and description are required"}
    question = crud.create_question(db_session, title, description)
    return {"question": question.title}

@bp.route("/question-lists", methods=["GET"])
def question_lists():
    questions = crud.read_questions()
    return {"questions": [question.title for question in questions]}