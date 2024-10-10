from app import crud
from app.constants import *
from app.crud import FilterType, SortType
from flask import Blueprint, jsonify, request

bp = Blueprint("routes", __name__)


@bp.route("/questions", methods=["POST"])
def post_question():
    # titleとdescriptionの取得
    title = request.json.get("title")
    description = request.json.get("description")
    if not title or not description:
        return jsonify({"error": "title and description are required"}), 400

    # 制約の確認
    if len(title) > MAX_TITLE_LENGTH:
        return jsonify({"error": "title is too long"}), 400
    if len(description) > MAX_DESCRIPTION_LENGTH:
        return jsonify({"error": "description is too long"}), 400

    # questionの作成
    question = crud.create_question(title, description)
    return jsonify(question.to_limited_dict()), 201


@bp.route("/questions", methods=["GET"])
def get_questions():

    # sortパラメータの処理
    sort_param = request.args.get(
        "sort", default=SortType.NEWEST, type=SortType.from_str
    )

    # pagesizeパラメータの処理
    pagesize_param = request.args.get("pagesize", default=DEFAULT_PAGE_SIZE, type=int)
    if pagesize_param < MIN_PAGE_SIZE:
        return jsonify({"error": f"pagesize must be greater than {MIN_PAGE_SIZE}"}), 400
    if pagesize_param > MAX_PAGE_SIZE:
        return jsonify({"error": f"pagesize must be less than {MAX_PAGE_SIZE}"}), 400

    # pageパラメータの処理
    page_param = request.args.get("page", default=1, type=int)

    # filterパラメータの処理
    filters_param = request.args.get("filters", default=None, type=FilterType.from_str)

    questions, total_pages = crud.read_questions_by_page(
        sort_param,
        page_param,
        pagesize_param,
        filters_param,
    )

    if page_param > total_pages:
        return jsonify({"error": "page not found"}), 404

    return (
        jsonify(
            {
                "questions": [question.to_limited_dict() for question in questions],
                "pagination": {
                    "currentPage": page_param,
                    "totalPages": total_pages,
                },
            }
        ),
        200,
    )


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
    if len(description) > MAX_DESCRIPTION_LENGTH:
        return jsonify({"error": "description is too long"}), 400
    # answerの作成
    answer = crud.create_answer(question_id, description)
    return jsonify(answer.to_limited_dict()), 201
