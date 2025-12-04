from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base

class Personal(Base):
    __tablename__ = "personal"
    
    id = Column(Integer, primary_key=True, index=True)
    avatar_url = Column(String(255), nullable=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    patronymic = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    tg = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    username = Column(String(50), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    
    appointments_as_doctor = relationship("Appointment", back_populates="doctor")
    records_as_doctor = relationship("PatientRecords", back_populates="doctor")
    teeth_history_as_doctor = relationship("TeethHistory", back_populates="doctor")