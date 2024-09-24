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
            crud.create_question(f"title {i}", f"description {i}")
            crud.create_answer(i, f"description{i}")

        click.echo("Initialized database with dummy data")
    else:
        click.echo("Add --force to initialize database")
