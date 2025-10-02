from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Doctor(Base):
    __tablename__ = "doctors"

    user_id = Column(Integer, primary_key=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    experience_years = Column(Integer)
    biography = Column(String(1000))
    is_active = Column(Boolean, default=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))

    # Relationships
    allergies = relationship("Allergy", back_populates="doctor")
    medical_records = relationship("MedicalRecord", back_populates="doctor")
    subcategory = relationship("Subcategory", back_populates="doctors")