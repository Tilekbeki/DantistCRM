from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)
    address = Column(String(255))
    phone_number = Column(String(20))
    tgUsername = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="active")

    # # Relationships
    # allergies = relationship("Allergy", back_populates="patient")
    # medical_records = relationship("MedicalRecord", back_populates="patient")