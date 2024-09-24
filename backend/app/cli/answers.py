from pprint import pp

import click
from app import crud
from app.crud import SortType
from flask import Blueprint

bp = Blueprint("answers", __name__)


@bp.cli.command("read")
@click.option(
    "-s", "--sort", type=str, default=SortType.default().name, help="sort type"
)
def read_answers(sort: str):
    answers = crud.read_answers(SortType.from_str(sort))
    pp([answer.to_dict() for answer in answers])


@bp.cli.command("create")
@click.argument("question_id")
@click.argument("description")
def create_answer(question_id: int, description: str):
    if crud.read_question_by_id(question_id):
        answer = crud.create_answer(question_id, description)
        pp(answer.to_dict())
    else:
        print("error", "question not found")
