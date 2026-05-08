from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class TreatmentPlan(Base):
    __tablename__ = "treatment_plans"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("personal.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    title = Column(String(200), nullable=False)
    diagnosis = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="planned")
    tooth_numbers = Column(String(200), nullable=True)
    planned_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    patient = relationship("Patient")
    doctor = relationship("Personal")
    service = relationship("Service")
    appointment = relationship("Appointment")
