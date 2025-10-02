from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.user_id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    visit_date = Column(Date, nullable=False)
    diagnosis = Column(String(500))
    notes = Column(String(1000))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
    service = relationship("Service", back_populates="medical_records")
    medical_images = relationship("MedicalImage", back_populates="medical_record")