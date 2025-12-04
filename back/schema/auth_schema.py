# schema/auth_schema.py
import strawberry
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from database import SessionLocal
from models.personal import Personal
from .base import QueryResult
import hashlib

# Настройки JWT
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Простая реализация хеширования пароля (только для разработки!)
def get_password_hash(password: str) -> str:
    """Простое хеширование пароля для разработки"""
    # Обрезаем пароль если слишком длинный
    if len(password) > 72:
        password = password[:72]
    
    # Используем SHA-256 для разработки
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля для разработки"""
    if len(plain_password) > 72:
        plain_password = plain_password[:72]
    
    hashed_input = hashlib.sha256(plain_password.encode()).hexdigest()
    return hashed_input == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@strawberry.type
class Token:
    access_token: str
    token_type: str
    expires_in: int
    user_id: int
    username: str
    role: str
    name: str
    surname: str

@strawberry.input
class RegisterInput:
    username: str
    email: str
    password: str
    name: str
    surname: str
    patronymic: Optional[str] = None
    role: str = "reception"

@strawberry.input
class LoginInput:
    username: str
    password: str

def get_personal_by_username(username: str) -> Optional[Personal]:
    db = SessionLocal()
    try:
        personal = db.query(Personal).filter(
            (Personal.username == username) | (Personal.email == username)
        ).first()
        return personal
    finally:
        db.close()

@strawberry.type
class AuthQuery:
    @strawberry.field
    def get_current_user(self, info) -> Optional[str]:
        user = info.context.get("current_user")
        return user.username if user else None

@strawberry.type
class AuthMutation:
    @strawberry.mutation
    def login(self, info, input: LoginInput) -> Token:
        personal = get_personal_by_username(input.username)
        if not personal:
            raise Exception("Пользователь не найден")
        
        if not personal.hashed_password:
            raise Exception("Пароль не установлен")
        
        if not personal.is_active:
            raise Exception("Учетная запись неактивна")
        
        # Проверяем пароль
        if not verify_password(input.password, personal.hashed_password):
            raise Exception("Неверный пароль")
        
        # Обновляем время последнего входа
        db = SessionLocal()
        try:
            personal.last_login = datetime.utcnow()
            db.commit()
        finally:
            db.close()
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={
                "sub": personal.username, 
                "user_id": personal.id, 
                "role": personal.role,
                "name": personal.name,
                "surname": personal.surname
            },
            expires_delta=access_token_expires
        )
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=personal.id,
            username=personal.username,
            role=personal.role,
            name=personal.name,
            surname=personal.surname
        )

    @strawberry.mutation
    def register(self, info, input: RegisterInput) -> QueryResult:
        db = SessionLocal()
        try:
            # Проверяем, существует ли пользователь
            existing = db.query(Personal).filter(
                (Personal.username == input.username) | (Personal.email == input.email)
            ).first()
            
            if existing:
                return QueryResult(
                    success=False,
                    message="Пользователь с таким именем или email уже существует"
                )
            
            # Проверяем длину пароля
            if len(input.password) > 72:
                return QueryResult(
                    success=False,
                    message="Пароль слишком длинный (максимум 72 символа)"
                )
            
            # Создаем нового сотрудника с хешированным паролем
            hashed_password = get_password_hash(input.password)
            personal = Personal(
                username=input.username,
                email=input.email,
                hashed_password=hashed_password,
                name=input.name,
                surname=input.surname,
                patronymic=input.patronymic,
                role=input.role,
                is_active=True
            )
            
            db.add(personal)
            db.commit()
            db.refresh(personal)
            
            return QueryResult(
                success=True,
                message="Сотрудник успешно зарегистрирован",
                data=personal.id
            )
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()