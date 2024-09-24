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
