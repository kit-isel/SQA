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
    answers = crud.read_answers(SortType.from_str(sort), include_deleted=True)
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


@bp.cli.command("delete")
@click.argument("id")
@click.option("-f", "--force", is_flag=True, help="force delete")
def delete_answer(id: int, force: bool):
    if force:
        crud.delete_answer_by_id(id)
    else:
        answer = crud.read_answer_by_id(id)
        if answer:
            answer.deleted = True
            answer = crud.update_answer(answer)
            pp(answer.to_dict())
        else:
            print("error", "answer not found")
