import strawberry
from typing import List, Optional
from database import SessionLocal
from models.medical_records import PatientRecords
from .base import QueryResult

@strawberry.input
class PatientRecordsInput:
    patient_id: int
    doctor_id: int
    service_id: Optional[int] = None
    diagnose: Optional[str] = None
    notes: Optional[str] = None

@strawberry.type
class PatientRecordsType:
    id: int
    patient_id: int
    doctor_id: int
    service_id: Optional[int]
    diagnose: Optional[str]
    notes: Optional[str]
    created_at: str

@strawberry.type
class MedicalRecordsQuery:
    @strawberry.field
    def patient_record(self, id: int) -> Optional[PatientRecordsType]:
        db = SessionLocal()
        try:
            record = db.query(PatientRecords).filter(PatientRecords.id == id).first()
            if record:
                return PatientRecordsType(
                    id=record.id,
                    patient_id=record.patient_id,
                    doctor_id=record.doctor_id,
                    service_id=record.service_id,
                    diagnose=record.diagnose,
                    notes=record.notes,
                    created_at=record.created_at.isoformat()
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_patient_records(self, patient_id: Optional[int] = None) -> List[PatientRecordsType]:
        db = SessionLocal()
        try:
            query = db.query(PatientRecords)
            if patient_id:
                query = query.filter(PatientRecords.patient_id == patient_id)
            
            records = query.all()
            return [
                PatientRecordsType(
                    id=r.id,
                    patient_id=r.patient_id,
                    doctor_id=r.doctor_id,
                    service_id=r.service_id,
                    diagnose=r.diagnose,
                    notes=r.notes,
                    created_at=r.created_at.isoformat()
                ) for r in records
            ]
        finally:
            db.close()

@strawberry.type
class MedicalRecordsMutation:
    @strawberry.mutation
    def create_patient_record(self, input: PatientRecordsInput) -> QueryResult:
        db = SessionLocal()
        try:
            record = PatientRecords(**input.__dict__)
            db.add(record)
            db.commit()
            db.refresh(record)
            return QueryResult(success=True, message="Медицинская запись создана", data=record.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_patient_record(self, id: int, input: PatientRecordsInput) -> QueryResult:
        db = SessionLocal()
        try:
            record = db.query(PatientRecords).filter(PatientRecords.id == id).first()
            if not record:
                return QueryResult(success=False, message="Медицинская запись не найдена")
            
            for key, value in input.__dict__.items():
                if value is not None:
                    setattr(record, key, value)
            
            db.commit()
            return QueryResult(success=True, message="Медицинская запись обновлена")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()