from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.user_id"))
    service_id = Column(Integer, ForeignKey("services.id"))

    # Relationships
    doctors = relationship("Doctor", back_populates="subcategory")
    services = relationship("Service", back_populates="subcategory")