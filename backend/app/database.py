from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os
from dotenv import load_dotenv

load_dotenv()

password = os.environ.get("MYSQL_ROOT_PASSWORD")
dbname = os.environ.get("MYSQL_DATABASE")

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{password}@mysql:3306/{dbname}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

Base = declarative_base()


def init_db():
    import app.models

    Base.metadata.create_all(bind=engine)
