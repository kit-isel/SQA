from pprint import pp

import click
from app import crud
from app.crud import SortType
from flask import Blueprint

bp = Blueprint("questions", __name__)


@bp.cli.command("read")
@click.option(
    "-s", "--sort", type=str, default=SortType.default().name, help="sort type"
)
def read_questions(sort: str):
    questions = crud.read_questions(SortType.from_str(sort))
    pp([question.to_limited_dict() for question in questions])
