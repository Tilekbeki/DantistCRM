from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Allergies(Base):
    __tablename__ = "allergies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    
    # Relationships
    patient_allergies = relationship("PatientAllergies", back_populates="allergy")

class PatientAllergies(Base):
    __tablename__ = "patient_allergies"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    allergy_id = Column(Integer, ForeignKey("allergies.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    patient = relationship("Patient", back_populates="allergies")
    allergy = relationship("Allergies", back_populates="patient_allergies")