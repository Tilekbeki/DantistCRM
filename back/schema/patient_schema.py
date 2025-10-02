import strawberry
from typing import List, Optional
from strawberry.fastapi import GraphQLRouter
from sqlalchemy.orm import Session
from datetime import datetime
from database import SessionLocal
from models.patient import Patient

# Типы GraphQL
@strawberry.type
class PatientType:
    id: int
    first_name: str
    last_name: str
    date_of_birth: str
    gender: str
    address: Optional[str]
    phone_number: Optional[str]
    tgUsername: Optional[str]
    created_at: str
    status: str

@strawberry.input
class PatientInput:
    first_name: str
    last_name: str
    date_of_birth: str  # Формат: "YYYY-MM-DD"
    gender: str
    address: Optional[str] = None
    phone_number: Optional[str] = None
    tgUsername: Optional[str] = None
    status: Optional[str] = "active"

@strawberry.input
class PatientUpdateInput:
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    tgUsername: Optional[str] = None
    status: Optional[str] = None

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Query для пациентов
@strawberry.type
class PatientQuery:
    @strawberry.field
    def patients(self) -> List[PatientType]:
        db = SessionLocal()
        try:
            patients = db.query(Patient).all()
            return patients
        finally:
            db.close()

    @strawberry.field
    def patient(self, patient_id: int) -> Optional[PatientType]:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            return patient
        finally:
            db.close()

# Mutation для пациентов
@strawberry.type
class PatientMutation:
    @strawberry.mutation
    def create_patient(self, patient_data: PatientInput) -> PatientType:
        db = SessionLocal()
        try:
            # Преобразуем строку даты в объект date
            patient_dict = patient_data.__dict__.copy()
            patient_dict['date_of_birth'] = datetime.strptime(
                patient_dict['date_of_birth'], '%Y-%m-%d'
            ).date()
            
            patient = Patient(**patient_dict)
            db.add(patient)
            db.commit()
            db.refresh(patient)
            return patient
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    @strawberry.mutation
    def update_patient(self, patient_id: int, patient_data: PatientUpdateInput) -> Optional[PatientType]:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            
            if not patient:
                return None
            
            update_data = patient_data.__dict__
            for field, value in update_data.items():
                if value is not None:
                    if field == 'date_of_birth' and value:
                        setattr(patient, field, datetime.strptime(value, '%Y-%m-%d').date())
                    else:
                        setattr(patient, field, value)
            
            db.commit()
            db.refresh(patient)
            return patient
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

    @strawberry.mutation
    def delete_patient(self, patient_id: int) -> bool:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            
            if not patient:
                return False
            
            db.delete(patient)
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise e
        finally:
            db.close()

# Создаем схему
patient_schema = strawberry.Schema(query=PatientQuery, mutation=PatientMutation)
patient_graphql_app = GraphQLRouter(patient_schema)