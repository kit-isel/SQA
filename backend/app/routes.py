from app import crud
from app.crud import SortType
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

    # sortパラメータの処理
    sort_param = request.args.get("sort")
    if sort_param:
        try:
            sort_type = SortType.from_str(sort_param)
        except ValueError:
            return jsonify({"error": "invalid sort type"}), 400
    else:
        sort_type = SortType.default()

    data = crud.read_questions_with_answer_counts(sort_type)
    return jsonify(data), 200


@bp.route("/questions/<int:question_id>", methods=["GET"])
def get_question_with_answers_by_id(question_id: int):
    question_with_answers = crud.read_question_with_answers_by_id(question_id)
    if question_with_answers is None:
        return jsonify({"error": "question not found"}), 404
    question, answers = question_with_answers
    return (
        jsonify(
            question.to_dict() | {"answers": [answer.to_dict() for answer in answers]}
        ),
        200,
    )


@bp.route("/questions/<int:question_id>", methods=["GET"])
def get_question_with_answers_by_id(question_id: int):
    question_with_answers = crud.read_question_with_answers_by_id(question_id)
    if question_with_answers is None:
        return jsonify({"error": "question not found"}), 404
    question, answers = question_with_answers
    return (
        jsonify(
            question.to_dict() | {"answers": [answer.to_dict() for answer in answers]}
        ),
        200,
    )


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
