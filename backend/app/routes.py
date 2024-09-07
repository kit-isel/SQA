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


@bp.route("/questions/<int:question_id>", methods=["GET"])
def get_question_with_answers_by_id(question_id: int):
    question, answers = crud.read_question_with_answers_by_id(question_id)
    if question is None:
        return jsonify({"error": "question not found"}), 404
    return question.to_dict() | {"answers": [answer.to_dict() for answer in answers]}


@bp.route("/questions/<int:question_id>/answer", methods=["POST"])
def post_answer(question_id: int):
    # データのパース
    description = request.json.get("description")
    if not description:
        return jsonify({"error": "description is required"}), 400
    # question_idに対応するquestionが存在するか確認
    question = crud.read_question_by_id(question_id)
    if not question:
        return jsonify({"error": "question not found"}), 404
    answer = crud.create_answer(question_id, description)
    return jsonify(answer.to_dict()), 201
