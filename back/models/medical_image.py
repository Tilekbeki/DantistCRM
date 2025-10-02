from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class MedicalImage(Base):
    __tablename__ = "medical_images"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id"))
    patient_name = Column(String(200))
    image_url = Column(String(500), nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    medical_record = relationship("MedicalRecord", back_populates="medical_images")