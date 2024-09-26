from pprint import pformat

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
    questions = crud.read_questions(SortType.from_str(sort), include_deleted=True)
    click.echo(pformat([question.to_dict() for question in questions]))


@bp.cli.command("create")
@click.argument("title")
@click.argument("description")
def create_question(title: str, description: str):
    question = crud.create_question(title, description)
    click.echo(pformat(question.to_dict()))


@bp.cli.command("delete")
@click.argument("id")
@click.option("-f", "--force", is_flag=True, help="force delete")
def delete_question(id: int, force: bool):
    if force:
        crud.delete_question_by_id(id)
    else:
        question = crud.read_question_by_id(id)
        if question:
            question.deleted = True
            crud.commit()
            click.echo(pformat(question.to_dict()))
        else:
            click.echo("error", "question not found")
