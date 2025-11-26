from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Teeth(Base):
    __tablename__ = "teeth"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    tooth_number = Column(Integer, nullable=False)
    status = Column(String(50), default="healthy")
    
    # Relationships
    patient = relationship("Patient", back_populates="teeth")
    history = relationship("TeethHistory", back_populates="tooth")

class TeethHistory(Base):
    __tablename__ = "teeth_history"
    
    id = Column(Integer, primary_key=True, index=True)
    tooth_id = Column(Integer, ForeignKey("teeth.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("personal.id"), nullable=False)
    diagnosis = Column(String(200), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    tooth = relationship("Teeth", back_populates="history")
    service = relationship("Service", back_populates="teeth_history")
    doctor = relationship("Personal", back_populates="teeth_history_as_doctor")