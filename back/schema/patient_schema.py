import strawberry
from typing import List, Optional
from sqlalchemy.orm import Session
from database import SessionLocal
from models.patient import Patient
from .base import QueryResult

@strawberry.input
class PatientInput:
    avatar_link: Optional[str] = None
    name: str
    surname: str
    patronymic: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    tg: Optional[str] = None

@strawberry.type
class PatientType:
    id: int
    avatar_link: Optional[str]
    name: str
    surname: str
    patronymic: str
    email: Optional[str]
    phone_number: Optional[str]
    tg: Optional[str]
    created_at: str

@strawberry.type
class PatientQuery:
    @strawberry.field
    def patient(self, id: int) -> Optional[PatientType]:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if patient:
                return PatientType(
                    id=patient.id,
                    avatar_link=patient.avatar_link,
                    name=patient.name,
                    surname=patient.surname,
                    patronymic=patient.patronymic,
                    email=patient.email,
                    phone_number=patient.phone_number,
                    tg=patient.tg,
                    created_at=patient.created_at.isoformat()
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_patients(self) -> List[PatientType]:
        db = SessionLocal()
        try:
            patients = db.query(Patient).all()
            return [
                PatientType(
                    id=p.id,
                    avatar_link=p.avatar_link,
                    name=p.name,
                    surname=p.surname,
                    patronymic=p.patronymic,
                    email=p.email,
                    phone_number=p.phone_number,
                    tg=p.tg,
                    created_at=p.created_at.isoformat()
                ) for p in patients
            ]
        finally:
            db.close()

@strawberry.type
class PatientMutation:
    @strawberry.mutation
    def create_patient(self, input: PatientInput) -> QueryResult:
        db = SessionLocal()
        try:
            patient = Patient(**input.__dict__)
            db.add(patient)
            db.commit()
            db.refresh(patient)
            return QueryResult(success=True, message="Пациент создан", data=patient.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_patient(self, id: int, input: PatientInput) -> QueryResult:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if not patient:
                return QueryResult(success=False, message="Пациент не найден")
            
            for key, value in input.__dict__.items():
                if value is not None:
                    setattr(patient, key, value)
            
            db.commit()
            return QueryResult(success=True, message="Пациент обновлен")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()