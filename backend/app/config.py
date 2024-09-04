import os


# デフォルトの設定
class Config:
    # データベースの設定
    MYSQL_USER = os.getenv("MYSQL_USER")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_PORT = os.getenv("MYSQL_PORT")
    MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

    # データベースのURL
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"


# 開発環境の設定
class DevelopmentConfig(Config):
    DEBUG = True


# 本番環境の設定
class ProductionConfig(Config):
    DEBUG = False


# テスト環境の設定
class TestingConfig(Config):
    TESTING = True
