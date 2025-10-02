import strawberry
from typing import List
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

# Тип GraphQL
@strawberry.type
class UserType:
    id: int
    name: str
    email: str

# Функция для сессии
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Query
@strawberry.type
class Query:
    @strawberry.field
    def users(self) -> List[UserType]:
        db: Session = SessionLocal()
        users = db.query(User).all()
        return users

# Mutation
@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_user(self, name: str, email: str) -> UserType:
        db: Session = SessionLocal()
        user = User(name=name, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

schema = strawberry.Schema(query=Query, mutation=Mutation)
user_graphql_app = GraphQLRouter(schema)
