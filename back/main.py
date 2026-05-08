from datetime import datetime
from typing import Optional

import strawberry
from database import Base, engine
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from strawberry.fastapi import BaseContext, GraphQLRouter

from models import *
from models.personal import Personal
from schema import (
    AllergiesMutation,
    AllergiesQuery,
    AppointmentMutation,
    AppointmentQuery,
    AuthMutation,
    AuthQuery,
    MediaMutation,
    MediaQuery,
    PatientMutation,
    PatientQuery,
    PersonalMutation,
    PersonalQuery,
    ServicesMutation,
    ServicesQuery,
    TeethMutation,
    TeethQuery,
    TreatmentMutation,
    TreatmentQuery,
)

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"


async def get_current_user(request: Request) -> Optional[Personal]:
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")

        if username is None or user_id is None:
            return None

        from database import SessionLocal

        db = SessionLocal()
        try:
            return (
                db.query(Personal)
                .filter(
                    Personal.id == user_id,
                    Personal.username == username,
                    Personal.is_active == True,
                )
                .first()
            )
        finally:
            db.close()

    except (JWTError, ValueError):
        return None


class GraphQLContext(BaseContext):
    def __init__(self, current_user: Optional[Personal] = None):
        self.current_user = current_user


async def get_context(
    request: Request,
    current_user: Optional[Personal] = Depends(get_current_user),
) -> GraphQLContext:
    return GraphQLContext(current_user=current_user)


Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@strawberry.type
class Query(
    PersonalQuery,
    PatientQuery,
    AppointmentQuery,
    AllergiesQuery,
    TeethQuery,
    ServicesQuery,
    MediaQuery,
    TreatmentQuery,
    AuthQuery,
):
    pass


@strawberry.type
class Mutation(
    PersonalMutation,
    PatientMutation,
    AppointmentMutation,
    AllergiesMutation,
    TeethMutation,
    ServicesMutation,
    MediaMutation,
    TreatmentMutation,
    AuthMutation,
):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema, context_getter=get_context)

app.include_router(graphql_app, prefix="/graphql")


@app.on_event("startup")
async def create_admin_user():
    from database import SessionLocal
    from schema.auth_schema import get_password_hash, get_personal_by_username

    db = SessionLocal()
    try:
        admin = get_personal_by_username("admin")
        if not admin:
            hashed_password = get_password_hash("admin123")
            admin_user = Personal(
                username="admin",
                email="admin@dantistcrm.com",
                hashed_password=hashed_password,
                name="Administrator",
                surname="System",
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("Admin created: admin / admin123")
    except Exception as e:
        print(f"Admin creation error: {e}")
    finally:
        db.close()
