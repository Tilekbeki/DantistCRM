from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class PatientMedia(Base):
    __tablename__ = "patient_media"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True)
    type = Column(String(50), nullable=False)
    file_url = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="media")
    appointment = relationship("Appointment", back_populates="media")