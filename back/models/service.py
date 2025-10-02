from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"))
    name = Column(String(200), nullable=False)
    description = Column(String(500))
    price = Column(Integer)
    default_duration_minute = Column(Integer)
    service_fee = Column(Integer)

    # Relationships
    subcategory = relationship("Subcategory", back_populates="services")
    medical_records = relationship("MedicalRecord", back_populates="service")