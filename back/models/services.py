from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class Categories(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True)
    
    # Relationships
    services = relationship("Service", back_populates="category")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    
    # Relationships
    category = relationship("Categories", back_populates="services")
    appointments = relationship("Appointment", back_populates="service")
    records = relationship("PatientRecords", back_populates="service")
    teeth_history = relationship("TeethHistory", back_populates="service")