import strawberry
from typing import List, Optional
from database import SessionLocal
from models.allergies import Allergies, PatientAllergies
from .base import QueryResult

@strawberry.input
class AllergyInput:
    name: str
    description: Optional[str] = None

@strawberry.input
class PatientAllergiesInput:
    patient_id: int
    allergy_id: int

@strawberry.type
class AllergyType:
    id: int
    name: str
    description: Optional[str]

@strawberry.type
class PatientAllergiesType:
    id: int
    patient_id: int
    allergy_id: int
    created_at: str

@strawberry.type
class AllergiesQuery:
    @strawberry.field
    def allergy(self, id: int) -> Optional[AllergyType]:
        db = SessionLocal()
        try:
            allergy = db.query(Allergies).filter(Allergies.id == id).first()
            if allergy:
                return AllergyType(
                    id=allergy.id,
                    name=allergy.name,
                    description=allergy.description
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_allergies(self) -> List[AllergyType]:
        db = SessionLocal()
        try:
            allergies = db.query(Allergies).all()
            return [
                AllergyType(
                    id=a.id,
                    name=a.name,
                    description=a.description
                ) for a in allergies
            ]
        finally:
            db.close()

    @strawberry.field
    def patient_allergies(self, patient_id: int) -> List[PatientAllergiesType]:
        db = SessionLocal()
        try:
            patient_allergies = db.query(PatientAllergies).filter(
                PatientAllergies.patient_id == patient_id
            ).all()
            return [
                PatientAllergiesType(
                    id=pa.id,
                    patient_id=pa.patient_id,
                    allergy_id=pa.allergy_id,
                    created_at=pa.created_at.isoformat()
                ) for pa in patient_allergies
            ]
        finally:
            db.close()

@strawberry.type
class AllergiesMutation:
    @strawberry.mutation
    def create_allergy(self, input: AllergyInput) -> QueryResult:
        db = SessionLocal()
        try:
            allergy = Allergies(**input.__dict__)
            db.add(allergy)
            db.commit()
            db.refresh(allergy)
            return QueryResult(success=True, message="Аллергия создана", data=allergy.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def add_patient_allergy(self, input: PatientAllergiesInput) -> QueryResult:
        db = SessionLocal()
        try:
            # Проверяем, есть ли уже такая аллергия у пациента
            existing = db.query(PatientAllergies).filter(
                PatientAllergies.patient_id == input.patient_id,
                PatientAllergies.allergy_id == input.allergy_id
            ).first()
            
            if existing:
                return QueryResult(success=False, message="Аллергия уже добавлена пациенту")
            
            patient_allergy = PatientAllergies(**input.__dict__)
            db.add(patient_allergy)
            db.commit()
            db.refresh(patient_allergy)
            return QueryResult(success=True, message="Аллергия добавлена пациенту", data=patient_allergy.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()