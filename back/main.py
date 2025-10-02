from fastapi import FastAPI
from database import Base, engine
from schema import user_graphql_app, patient_graphql_app
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Разрешенные origins
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы
    allow_headers=["*"],  # Разрешить все заголовки
)
# GraphQL доступен на /graphql
app.include_router(user_graphql_app, prefix="/graphql/user")
app.include_router(patient_graphql_app, prefix="/graphql/patient")
