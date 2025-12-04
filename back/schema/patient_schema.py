import strawberry
from typing import List, Optional
from enum import Enum
from datetime import date, datetime
from database import SessionLocal
from models.patient import Patient, Gender as GenderModel

# Добавьте эти импорты
from models.teeth import Teeth
from models.allergies import PatientAllergies
from models.medical_records import PatientRecords
from models.media import PatientMedia
from .base import QueryResult

@strawberry.enum
class Gender(Enum):
    MALE = "male"
    FEMALE = "female"

@strawberry.input
class PatientInput:
    avatar_link: Optional[str] = None
    name: str
    surname: str
    patronymic: str
    date_of_birth: Optional[str] = None  # Строка в формате "YYYY-MM-DD"
    email: Optional[str] = None
    phone_number: Optional[str] = None
    tg: Optional[str] = None
    gender: Optional[Gender] = Gender.MALE

@strawberry.type
class PatientType:
    id: int
    avatar_link: Optional[str]
    name: str
    surname: str
    patronymic: str
    date_of_birth: Optional[str]  # Строка в ISO формате
    email: Optional[str]
    phone_number: Optional[str]
    tg: Optional[str]
    gender: str
    createdAt: str
    
    @strawberry.field
    def age(self) -> Optional[int]:
        """Вычисляем возраст на основе даты рождения"""
        if not self.date_of_birth:
            return None
        
        try:
            birth_date = datetime.fromisoformat(self.date_of_birth).date()
            today = date.today()
            age = today.year - birth_date.year
            
            # Проверяем, был ли уже день рождения в этом году
            if (today.month, today.day) < (birth_date.month, birth_date.day):
                age -= 1
            
            return age
        except:
            return None

@strawberry.type
class PatientQuery:
    @strawberry.field
    def patient(self, id: int) -> Optional[PatientType]:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if patient:
                return PatientType(
                    id=patient.id,
                    avatar_link=patient.avatar_link,
                    name=patient.name,
                    surname=patient.surname,
                    patronymic=patient.patronymic,
                    date_of_birth=patient.date_of_birth.isoformat() if patient.date_of_birth else None,
                    email=patient.email,
                    phone_number=patient.phone_number,
                    tg=patient.tg,
                    gender=patient.gender.value if patient.gender else Gender.MALE.value,
                    createdAt=patient.created_at.isoformat()
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_patients(self) -> List[PatientType]:
        db = SessionLocal()
        try:
            patients = db.query(Patient).all()
            return [
                PatientType(
                    id=p.id,
                    avatar_link=p.avatar_link,
                    name=p.name,
                    surname=p.surname,
                    patronymic=p.patronymic,
                    date_of_birth=p.date_of_birth.isoformat() if p.date_of_birth else None,
                    email=p.email,
                    phone_number=p.phone_number,
                    tg=p.tg,
                    gender=p.gender.value if p.gender else Gender.MALE.value,
                    createdAt=p.created_at.isoformat()
                ) for p in patients
            ]
        finally:
            db.close()
    
    @strawberry.field
    def patients_by_age_range(self, min_age: Optional[int] = None, max_age: Optional[int] = None) -> List[PatientType]:
        db = SessionLocal()
        try:
            from sqlalchemy import and_, or_, func
            
            query = db.query(Patient)
            
            if min_age is not None or max_age is not None:
                today = date.today()
                
                # Фильтрация по возрасту
                if min_age is not None:
                    # Максимальная дата рождения для минимального возраста
                    max_birth_date = date(today.year - min_age, today.month, today.day)
                    query = query.filter(Patient.date_of_birth <= max_birth_date)
                
                if max_age is not None:
                    # Минимальная дата рождения для максимального возраста
                    min_birth_date = date(today.year - max_age - 1, today.month, today.day)
                    query = query.filter(Patient.date_of_birth >= min_birth_date)
            
            patients = query.all()
            return [
                PatientType(
                    id=p.id,
                    avatar_link=p.avatar_link,
                    name=p.name,
                    surname=p.surname,
                    patronymic=p.patronymic,
                    date_of_birth=p.date_of_birth.isoformat() if p.date_of_birth else None,
                    email=p.email,
                    phone_number=p.phone_number,
                    tg=p.tg,
                    gender=p.gender.value if p.gender else Gender.MALE.value,
                    created_at=p.created_at.isoformat()
                ) for p in patients
            ]
        finally:
            db.close()

@strawberry.type
class PatientMutation:
    @strawberry.mutation
    def create_patient(self, input: PatientInput) -> QueryResult:
        db = SessionLocal()
        try:
            patient_data = input.__dict__.copy()
            
            # Конвертируем дату рождения из строки в объект date
            if patient_data['date_of_birth']:
                try:
                    patient_data['date_of_birth'] = datetime.fromisoformat(
                        patient_data['date_of_birth']
                    ).date()
                except ValueError:
                    return QueryResult(
                        success=False, 
                        message="Некорректный формат даты рождения. Используйте YYYY-MM-DD"
                    )
            
            # Конвертируем Gender Enum
            if patient_data['gender']:
                patient_data['gender'] = patient_data['gender'].value
            
            patient = Patient(**patient_data)
            db.add(patient)
            db.commit()
            db.refresh(patient)
            return QueryResult(success=True, message="Пациент создан", data=patient.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_patient(self, id: int, input: PatientInput) -> QueryResult:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if not patient:
                return QueryResult(success=False, message="Пациент не найден")
            
            update_data = input.__dict__.copy()
            for key, value in update_data.items():
                if value is not None:
                    if key == 'date_of_birth' and value:
                        try:
                            # Конвертируем строку в date
                            setattr(patient, key, datetime.fromisoformat(value).date())
                        except ValueError:
                            return QueryResult(
                                success=False,
                                message="Некорректный формат даты рождения"
                            )
                    elif key == 'gender' and value:
                        setattr(patient, key, value.value)
                    else:
                        setattr(patient, key, value)
            
            db.commit()
            return QueryResult(success=True, message="Пациент обновлен", data=id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()
    @strawberry.mutation
    def deletePatient(self, id: int) -> QueryResult:  # camelCase
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if not patient:
                return QueryResult(success=False, message="Пациент не найден")
            
            # Проверяем, есть ли связанные записи
            if patient.appointments:
                return QueryResult(
                    success=False, 
                    message="Нельзя удалить пациента с активными записями на прием"
                )
            
            # Удаляем связанные данные перед удалением пациента
            db.query(Teeth).filter(Teeth.patient_id == id).delete()
            db.query(PatientAllergies).filter(PatientAllergies.patient_id == id).delete()
            db.query(PatientRecords).filter(PatientRecords.patient_id == id).delete()
            db.query(PatientMedia).filter(PatientMedia.patient_id == id).delete()
            
            # Удаляем самого пациента
            db.delete(patient)
            db.commit()
            
            return QueryResult(success=True, message="Пациент удален", data=id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()