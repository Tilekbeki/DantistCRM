from fastapi import FastAPI
from database import Base, engine
from schema.patient_schema import PatientQuery, PatientMutation
from schema.user_schema import Query, Mutation
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Объединяем Query и Mutation из обеих схем
@strawberry.type
class CombinedQuery(Query, PatientQuery):
    pass

@strawberry.type
class CombinedMutation(Mutation, PatientMutation):
    pass

# Создаем общую схему
schema = strawberry.Schema(query=CombinedQuery, mutation=CombinedMutation)
combined_graphql_app = GraphQLRouter(schema)

# Единый endpoint для всей GraphQL API
app.include_router(combined_graphql_app, prefix="/graphql")