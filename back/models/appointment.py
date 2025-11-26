from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("personal.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    visit_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="planned")
    
    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Personal", back_populates="appointments_as_doctor")
    service = relationship("Service", back_populates="appointments")
    media = relationship("PatientMedia", back_populates="appointment")