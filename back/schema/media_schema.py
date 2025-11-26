import strawberry
from typing import List, Optional
from database import SessionLocal
from models.media import PatientMedia
from .base import QueryResult

@strawberry.input
class PatientMediaInput:
    patient_id: int
    appointment_id: Optional[int] = None
    type: str
    file_url: str

@strawberry.type
class PatientMediaType:
    id: int
    patient_id: int
    appointment_id: Optional[int]
    type: str
    file_url: str
    uploaded_at: str

@strawberry.type
class MediaQuery:
    @strawberry.field
    def patient_media(self, patient_id: int) -> List[PatientMediaType]:
        db = SessionLocal()
        try:
            media = db.query(PatientMedia).filter(
                PatientMedia.patient_id == patient_id
            ).order_by(PatientMedia.uploaded_at.desc()).all()
            return [
                PatientMediaType(
                    id=m.id,
                    patient_id=m.patient_id,
                    appointment_id=m.appointment_id,
                    type=m.type,
                    file_url=m.file_url,
                    uploaded_at=m.uploaded_at.isoformat()
                ) for m in media
            ]
        finally:
            db.close()

    @strawberry.field
    def appointment_media(self, appointment_id: int) -> List[PatientMediaType]:
        db = SessionLocal()
        try:
            media = db.query(PatientMedia).filter(
                PatientMedia.appointment_id == appointment_id
            ).order_by(PatientMedia.uploaded_at.desc()).all()
            return [
                PatientMediaType(
                    id=m.id,
                    patient_id=m.patient_id,
                    appointment_id=m.appointment_id,
                    type=m.type,
                    file_url=m.file_url,
                    uploaded_at=m.uploaded_at.isoformat()
                ) for m in media
            ]
        finally:
            db.close()

@strawberry.type
class MediaMutation:
    @strawberry.mutation
    def create_patient_media(self, input: PatientMediaInput) -> QueryResult:
        db = SessionLocal()
        try:
            media = PatientMedia(**input.__dict__)
            db.add(media)
            db.commit()
            db.refresh(media)
            return QueryResult(success=True, message="Медиа файл добавлен", data=media.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def delete_patient_media(self, id: int) -> QueryResult:
        db = SessionLocal()
        try:
            media = db.query(PatientMedia).filter(PatientMedia.id == id).first()
            if not media:
                return QueryResult(success=False, message="Медиа файл не найден")
            
            db.delete(media)
            db.commit()
            return QueryResult(success=True, message="Медиа файл удален")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()