from datetime import datetime, timedelta
from random import randint

import click
from app import crud
from app.crud import SortType
from app.database import db
from flask import Blueprint

bp = Blueprint("init", __name__)


@bp.cli.command("all")
@click.option("-f", "--force", is_flag=True, help="force init")
def init_all(force: bool):
    if force:
        db.drop_all()
        db.create_all()
        click.echo("Initialized database")
    else:
        click.echo("Add --force to initialize database")


@bp.cli.command("dummy")
@click.argument("count", type=int)
@click.option("-f", "--force", is_flag=True, help="force init")
def init_random(count: int, force: bool):
    if force:
        db.drop_all()
        db.create_all()
        for i in range(1, count + 1):
            question = crud.create_question(f"title {i}", f"description {i}")
            question.created_at = random_datetime(
                datetime(2023, 1, 1), datetime.now() - timedelta(days=1)
            )
            crud.commit()

            for j in range(1, randint(1, 5)):
                answer = crud.create_answer(question.id, f"description {i}-{j}")
                answer.created_at = random_datetime(question.created_at, datetime.now())
                crud.commit()

        click.echo("Initialized database with dummy data")
    else:
        click.echo("Add --force to initialize database")


def random_datetime(
    start: datetime,
    end: datetime,
) -> datetime:
    return start + (end - start) * randint(0, 1000) / 1000
