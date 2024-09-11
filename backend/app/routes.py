from app import crud
from app.constants import DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH
from app.crud import SortType
from app.database import db
from flask import Blueprint, current_app, jsonify, request

bp = Blueprint("routes", __name__)


@bp.route("/questions", methods=["POST"])
def post_question():
    # titleとdescriptionの取得
    title = request.json.get("title")
    description = request.json.get("description")
    if not title or not description:
        return jsonify({"error": "title and description are required"}), 400

    # 制約の確認
    if len(title) > TITLE_MAX_LENGTH:
        return jsonify({"error": "title is too long"}), 400
    if len(description) > DESCRIPTION_MAX_LENGTH:
        return jsonify({"error": "description is too long"}), 400

    # questionの作成
    question = crud.create_question(title, description)
    return jsonify(question.to_limited_dict()), 201


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

    questions = crud.read_questions(sort_type)
    return jsonify([question.to_limited_dict() for question in questions]), 200


@bp.route("/questions/<int:question_id>", methods=["GET"])
def get_question_by_id(question_id: int):
    question = crud.read_question_by_id(question_id)
    if question is None:
        return jsonify({"error": "question not found"}), 404

    return jsonify(question.to_limited_dict()), 200


@bp.route("/questions/<int:question_id>/answers", methods=["POST"])
def post_answer(question_id: int):
    # データの取得
    description = request.json.get("description")
    if not description:
        return jsonify({"error": "description is required"}), 400
    # 制約の確認
    question = crud.read_question_by_id(question_id)
    if not question:
        return jsonify({"error": "question not found"}), 404
    if len(description) > DESCRIPTION_MAX_LENGTH:
        return jsonify({"error": "description is too long"}), 400
    # answerの作成
    answer = crud.create_answer(question_id, description)
    return jsonify(answer.to_limited_dict()), 201
