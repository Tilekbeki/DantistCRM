# middleware/auth_middleware.py
from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
from database import SessionLocal
from models.personal import Personal

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

security = HTTPBearer()

async def get_current_user(request: Request) -> Optional[Personal]:
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        return None
    
    try:
        # Извлекаем токен из заголовка
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None
        
        # Декодируем JWT токен
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        
        if username is None or user_id is None:
            return None
        
        # Получаем пользователя из базы данных
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