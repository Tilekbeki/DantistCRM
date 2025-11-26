import strawberry
from typing import List, Optional
from sqlalchemy.orm import Session
from database import SessionLocal
from models.appointment import Appointment
from .base import QueryResult

@strawberry.input
class AppointmentInput:
    patient_id: int
    doctor_id: int
    service_id: Optional[int] = None
    visit_date: str
    status: Optional[str] = "planned"

@strawberry.type
class AppointmentType:
    id: int
    patient_id: int
    doctor_id: int
    service_id: Optional[int]
    created_at: str
    visit_date: str
    status: str

@strawberry.type
class AppointmentQuery:
    @strawberry.field
    def appointment(self, id: int) -> Optional[AppointmentType]:
        db = SessionLocal()
        try:
            appointment = db.query(Appointment).filter(Appointment.id == id).first()
            if appointment:
                return AppointmentType(
                    id=appointment.id,
                    patient_id=appointment.patient_id,
                    doctor_id=appointment.doctor_id,
                    service_id=appointment.service_id,
                    created_at=appointment.created_at.isoformat(),
                    visit_date=appointment.visit_date.isoformat(),
                    status=appointment.status
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_appointments(self, patient_id: Optional[int] = None, doctor_id: Optional[int] = None) -> List[AppointmentType]:
        db = SessionLocal()
        try:
            query = db.query(Appointment)
            if patient_id:
                query = query.filter(Appointment.patient_id == patient_id)
            if doctor_id:
                query = query.filter(Appointment.doctor_id == doctor_id)
            
            appointments = query.all()
            return [
                AppointmentType(
                    id=a.id,
                    patient_id=a.patient_id,
                    doctor_id=a.doctor_id,
                    service_id=a.service_id,
                    created_at=a.created_at.isoformat(),
                    visit_date=a.visit_date.isoformat(),
                    status=a.status
                ) for a in appointments
            ]
        finally:
            db.close()

@strawberry.type
class AppointmentMutation:
    @strawberry.mutation
    def create_appointment(self, input: AppointmentInput) -> QueryResult:
        db = SessionLocal()
        try:
            from datetime import datetime
            appointment_data = input.__dict__.copy()
            appointment_data['visit_date'] = datetime.fromisoformat(appointment_data['visit_date'])
            
            appointment = Appointment(**appointment_data)
            db.add(appointment)
            db.commit()
            db.refresh(appointment)
            return QueryResult(success=True, message="Запись создана", data=appointment.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()