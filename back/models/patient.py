from sqlalchemy import Column, Integer, String, DateTime, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .base import Base
import enum
from datetime import date

class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"

class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    avatar_link = Column(String(255), nullable=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    patronymic = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=True)  # Добавляем дату рождения
    email = Column(String(255), unique=True, nullable=True)
    phone_number = Column(String(20), nullable=True)
    tg = Column(String(100), nullable=True)
    gender = Column(SQLEnum(Gender), default=Gender.MALE)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    appointments = relationship("Appointment", back_populates="patient")
    records = relationship("PatientRecords", back_populates="patient")
    teeth = relationship("Teeth", back_populates="patient")
    allergies = relationship("PatientAllergies", back_populates="patient")
    media = relationship("PatientMedia", back_populates="patient")