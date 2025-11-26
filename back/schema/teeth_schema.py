import strawberry
from typing import List, Optional
from database import SessionLocal
from models.teeth import Teeth, TeethHistory
from .base import QueryResult

@strawberry.input
class TeethInput:
    patient_id: int
    tooth_number: int
    status: str = "healthy"

@strawberry.input
class TeethHistoryInput:
    tooth_id: int
    service_id: Optional[int] = None
    doctor_id: int
    diagnosis: Optional[str] = None
    notes: Optional[str] = None

@strawberry.type
class TeethType:
    id: int
    patient_id: int
    tooth_number: int
    status: str

@strawberry.type
class TeethHistoryType:
    id: int
    tooth_id: int
    service_id: Optional[int]
    doctor_id: int
    diagnosis: Optional[str]
    notes: Optional[str]
    created_at: str

@strawberry.type
class TeethQuery:
    @strawberry.field
    def teeth_for_patient(self, patient_id: int) -> List[TeethType]:
        db = SessionLocal()
        try:
            teeth = db.query(Teeth).filter(Teeth.patient_id == patient_id).all()
            return [
                TeethType(
                    id=t.id,
                    patient_id=t.patient_id,
                    tooth_number=t.tooth_number,
                    status=t.status
                ) for t in teeth
            ]
        finally:
            db.close()

    @strawberry.field
    def tooth_history(self, tooth_id: int) -> List[TeethHistoryType]:
        db = SessionLocal()
        try:
            history = db.query(TeethHistory).filter(
                TeethHistory.tooth_id == tooth_id
            ).order_by(TeethHistory.created_at.desc()).all()
            return [
                TeethHistoryType(
                    id=th.id,
                    tooth_id=th.tooth_id,
                    service_id=th.service_id,
                    doctor_id=th.doctor_id,
                    diagnosis=th.diagnosis,
                    notes=th.notes,
                    created_at=th.created_at.isoformat()
                ) for th in history
            ]
        finally:
            db.close()

@strawberry.type
class TeethMutation:
    @strawberry.mutation
    def create_teeth_record(self, input: TeethInput) -> QueryResult:
        db = SessionLocal()
        try:
            from sqlalchemy import and_
            # Проверяем, есть ли уже запись для этого зуба у пациента
            existing_teeth = db.query(Teeth).filter(
                and_(Teeth.patient_id == input.patient_id, Teeth.tooth_number == input.tooth_number)
            ).first()
            
            if existing_teeth:
                # Обновляем существующую запись
                existing_teeth.status = input.status
                db.commit()
                return QueryResult(success=True, message="Зуб обновлен", data=existing_teeth.id)
            else:
                # Создаем новую запись
                teeth = Teeth(**input.__dict__)
                db.add(teeth)
                db.commit()
                db.refresh(teeth)
                return QueryResult(success=True, message="Зуб успешно добавлен", data=teeth.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def add_teeth_history(self, input: TeethHistoryInput) -> QueryResult:
        db = SessionLocal()
        try:
            history = TeethHistory(**input.__dict__)
            db.add(history)
            db.commit()
            db.refresh(history)
            return QueryResult(success=True, message="История зуба добавлена", data=history.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()