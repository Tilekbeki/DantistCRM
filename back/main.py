from fastapi import FastAPI
from database import Base, engine
from schema import graphql_app

Base.metadata.create_all(bind=engine)

app = FastAPI()

# GraphQL доступен на /graphql
app.include_router(graphql_app, prefix="/graphql")
