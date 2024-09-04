from app import crud
from app.database import db
from flask import Blueprint, jsonify, request

bp = Blueprint("routes", __name__)


@bp.route("/questions/ask", methods=["POST"])
def post_ask():
    if not request.json:
        return jsonify({"error": "title and description are required"}), 400
    title = request.json.get("title")
    description = request.json.get("description")
    if not title or not description:
        return jsonify({"error": "title and description are required"}), 400
    question = crud.create_question(title, description)
    return jsonify(question.to_dict()), 201


@bp.route("/questions", methods=["GET"])
def get_questions():
    questions = crud.read_questions(db.session)
    return [
        {
            "title": question.title,
            "description": question.description,
            "answer_counts": question.answer_counts,
        }
        for question in questions
    ]
