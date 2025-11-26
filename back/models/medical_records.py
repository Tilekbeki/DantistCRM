from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class PatientRecords(Base):
    __tablename__ = "patient_records"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("personal.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    diagnose = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="records")
    doctor = relationship("Personal", back_populates="records_as_doctor")
    service = relationship("Service", back_populates="records")