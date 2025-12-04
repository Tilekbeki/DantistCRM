from fastapi import FastAPI, Request, Depends
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from strawberry.fastapi import GraphQLRouter, BaseContext
from typing import Optional

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
    MediaQuery, MediaMutation,
    AuthQuery, AuthMutation  # Теперь есть этот импорт
)
from models.personal import Personal

# Middleware для JWT аутентификации
from jose import jwt, JWTError
from datetime import datetime

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
            personal = db.query(Personal).filter(
                Personal.id == user_id, 
                Personal.username == username,
                Personal.is_active == True
            ).first()
            return personal
        finally:
            db.close()
            
    except (JWTError, ValueError):
        return None

# Контекст для GraphQL
class GraphQLContext(BaseContext):
    def __init__(self, current_user: Optional[Personal] = None):
        self.current_user = current_user

async def get_context(
    request: Request,
    current_user: Optional[Personal] = Depends(get_current_user)
) -> GraphQLContext:
    return GraphQLContext(current_user=current_user)

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
    MediaQuery,
    AuthQuery  # Добавляем AuthQuery
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
    MediaMutation,
    AuthMutation  # Добавляем AuthMutation
):
    pass

# Создаем общую схему
schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema, context_getter=get_context)

# Единый GraphQL endpoint
app.include_router(graphql_app, prefix="/graphql")

# Создаем администратора при запуске
@app.on_event("startup")
async def create_admin_user():
    from schema.auth_schema import get_personal_by_username, get_password_hash
    from database import SessionLocal
    
    db = SessionLocal()
    try:
        admin = get_personal_by_username("admin")
        if not admin:
            hashed_password = get_password_hash("admin123")
            admin_user = Personal(
                username="admin",
                email="admin@dantistcrm.com",
                hashed_password=hashed_password,
                name="Администратор",
                surname="Системы",
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Администратор создан: admin / admin123")
    except Exception as e:
        print(f"Ошибка создания администратора: {e}")
    finally:
        db.close()