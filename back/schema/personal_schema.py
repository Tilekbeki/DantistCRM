import strawberry
from typing import List, Optional
from database import SessionLocal
from models.personal import Personal
from .base import QueryResult

@strawberry.input
class PersonalInput:
    avatar_url: Optional[str] = None
    name: str
    surname: str
    patronymic: Optional[str] = None
    role: str
    email: Optional[str] = None
    tg: Optional[str] = None
    phone_number: Optional[str] = None

@strawberry.type
class PersonalType:
    id: int
    avatar_url: Optional[str]
    name: str
    surname: str
    patronymic: Optional[str]
    role: str
    email: Optional[str]
    tg: Optional[str]
    phone_number: Optional[str]
    created_at: str

@strawberry.type
class PersonalQuery:
    @strawberry.field
    def personal(self, id: int) -> Optional[PersonalType]:
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if personal:
                return PersonalType(
                    id=personal.id,
                    avatar_url=personal.avatar_url,
                    name=personal.name,
                    surname=personal.surname,
                    patronymic=personal.patronymic,
                    role=personal.role,
                    email=personal.email,
                    tg=personal.tg,
                    phone_number=personal.phone_number,
                    created_at=personal.created_at.isoformat()
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_personal(self, role: Optional[str] = None) -> List[PersonalType]:
        db = SessionLocal()
        try:
            query = db.query(Personal)
            if role:
                query = query.filter(Personal.role == role)
            
            personnel = query.all()
            return [
                PersonalType(
                    id=p.id,
                    avatar_url=p.avatar_url,
                    name=p.name,
                    surname=p.surname,
                    patronymic=p.patronymic,
                    role=p.role,
                    email=p.email,
                    tg=p.tg,
                    phone_number=p.phone_number,
                    created_at=p.created_at.isoformat()
                ) for p in personnel
            ]
        finally:
            db.close()

@strawberry.type
class PersonalMutation:
    @strawberry.mutation
    def create_personal(self, input: PersonalInput) -> QueryResult:
        db = SessionLocal()
        try:
            personal = Personal(**input.__dict__)
            db.add(personal)
            db.commit()
            db.refresh(personal)
            return QueryResult(success=True, message="Персонал создан", data=personal.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_personal(self, id: int, input: PersonalInput) -> QueryResult:
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if not personal:
                return QueryResult(success=False, message="Персонал не найден")
            
            for key, value in input.__dict__.items():
                if value is not None:
                    setattr(personal, key, value)
            
            db.commit()
            return QueryResult(success=True, message="Персонал обновлен")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()