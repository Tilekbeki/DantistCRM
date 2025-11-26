from fastapi import FastAPI
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter

# Импортируем все модели для создания таблиц
from models import *
# Импортируем все схемы
from schema import (
    PersonalQuery, PersonalMutation,
    PatientQuery, PatientMutation,
    AppointmentQuery, AppointmentMutation,
    AllergiesQuery, AllergiesMutation,
    TeethQuery, TeethMutation,
    ServicesQuery, ServicesMutation,
    MediaQuery, MediaMutation
)

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Объединяем все Query
@strawberry.type
class Query(
    PersonalQuery,
    PatientQuery,
    AppointmentQuery,
    AllergiesQuery,
    TeethQuery,
    ServicesQuery,
    MediaQuery
):
    pass

# Объединяем все Mutation
@strawberry.type
class Mutation(
    PersonalMutation,
    PatientMutation,
    AppointmentMutation,
    AllergiesMutation,
    TeethMutation,
    ServicesMutation,
    MediaMutation
):
    pass

# Создаем общую схему
schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema)

# Единый GraphQL endpoint
app.include_router(graphql_app, prefix="/graphql")