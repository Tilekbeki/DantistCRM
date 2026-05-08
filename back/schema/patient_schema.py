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
from models.appointment import Appointment
from models.personal import Personal
from models.services import Service
from models.treatment import TreatmentPlan
from models.teeth import TeethHistory
from .base import QueryResult
from .treatment_schema import parse_tooth_numbers

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
class PatientDoctorSummaryType:
    id: int
    name: str
    surname: str
    patronymic: Optional[str]
    role: str


@strawberry.type
class PatientServiceSummaryType:
    id: int
    name: str
    description: Optional[str]
    duration: int
    price: float


@strawberry.type
class PatientMediaSummaryType:
    id: int
    patient_id: int
    appointment_id: Optional[int]
    type: str
    file_url: str
    uploaded_at: str


@strawberry.type
class PatientAppointmentSummaryType:
    id: int
    visit_date: str
    created_at: str
    status: str
    doctor: Optional[PatientDoctorSummaryType]
    service: Optional[PatientServiceSummaryType]
    media: List[PatientMediaSummaryType]


@strawberry.type
class PatientRecordSummaryType:
    id: int
    diagnose: Optional[str]
    notes: Optional[str]
    created_at: str
    doctor: Optional[PatientDoctorSummaryType]
    service: Optional[PatientServiceSummaryType]


@strawberry.type
class PatientToothHistorySummaryType:
    id: int
    diagnosis: Optional[str]
    notes: Optional[str]
    created_at: str
    doctor: Optional[PatientDoctorSummaryType]
    service: Optional[PatientServiceSummaryType]


@strawberry.type
class PatientToothSummaryType:
    id: int
    tooth_number: int
    status: str
    history: List[PatientToothHistorySummaryType]


@strawberry.type
class PatientTreatmentPlanSummaryType:
    id: int
    title: str
    diagnosis: Optional[str]
    notes: Optional[str]
    status: str
    tooth_numbers: List[int]
    planned_at: Optional[str]
    created_at: str
    doctor: Optional[PatientDoctorSummaryType]
    service: Optional[PatientServiceSummaryType]
    appointment: Optional[PatientAppointmentSummaryType]
    media: List[PatientMediaSummaryType]
    teeth: List[PatientToothSummaryType]


@strawberry.type
class PatientCardType:
    patient: PatientType
    appointments: List[PatientAppointmentSummaryType]
    records: List[PatientRecordSummaryType]
    media: List[PatientMediaSummaryType]
    teeth: List[PatientToothSummaryType]
    treatment_plans: List[PatientTreatmentPlanSummaryType]


def doctor_summary(doctor: Optional[Personal]) -> Optional[PatientDoctorSummaryType]:
    if not doctor:
        return None

    return PatientDoctorSummaryType(
        id=doctor.id,
        name=doctor.name,
        surname=doctor.surname,
        patronymic=doctor.patronymic,
        role=doctor.role,
    )


def service_summary(service: Optional[Service]) -> Optional[PatientServiceSummaryType]:
    if not service:
        return None

    return PatientServiceSummaryType(
        id=service.id,
        name=service.name,
        description=service.description,
        duration=service.duration,
        price=service.price,
    )


def media_summary(media: PatientMedia) -> PatientMediaSummaryType:
    return PatientMediaSummaryType(
        id=media.id,
        patient_id=media.patient_id,
        appointment_id=media.appointment_id,
        type=media.type,
        file_url=media.file_url,
        uploaded_at=media.uploaded_at.isoformat(),
    )


def appointment_summary(appointment: Appointment) -> PatientAppointmentSummaryType:
    return PatientAppointmentSummaryType(
        id=appointment.id,
        visit_date=appointment.visit_date.isoformat(),
        created_at=appointment.created_at.isoformat(),
        status=appointment.status,
        doctor=doctor_summary(appointment.doctor),
        service=service_summary(appointment.service),
        media=[media_summary(item) for item in appointment.media],
    )

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
    def patient_card(self, id: int) -> Optional[PatientCardType]:
        db = SessionLocal()
        try:
            patient = db.query(Patient).filter(Patient.id == id).first()
            if not patient:
                return None

            patient_type = PatientType(
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

            appointments = [
                appointment_summary(item)
                for item in db.query(Appointment)
                .filter(Appointment.patient_id == id)
                .order_by(Appointment.visit_date.desc())
                .all()
            ]

            records = [
                PatientRecordSummaryType(
                    id=item.id,
                    diagnose=item.diagnose,
                    notes=item.notes,
                    created_at=item.created_at.isoformat(),
                    doctor=doctor_summary(item.doctor),
                    service=service_summary(item.service),
                )
                for item in db.query(PatientRecords)
                .filter(PatientRecords.patient_id == id)
                .order_by(PatientRecords.created_at.desc())
                .all()
            ]

            media = [
                media_summary(item)
                for item in db.query(PatientMedia)
                .filter(PatientMedia.patient_id == id)
                .order_by(PatientMedia.uploaded_at.desc())
                .all()
            ]

            teeth = [
                PatientToothSummaryType(
                    id=tooth.id,
                    tooth_number=tooth.tooth_number,
                    status=tooth.status,
                    history=[
                        PatientToothHistorySummaryType(
                            id=history.id,
                            diagnosis=history.diagnosis,
                            notes=history.notes,
                            created_at=history.created_at.isoformat(),
                            doctor=doctor_summary(history.doctor),
                            service=service_summary(history.service),
                        )
                        for history in db.query(TeethHistory)
                        .filter(TeethHistory.tooth_id == tooth.id)
                        .order_by(TeethHistory.created_at.desc())
                        .all()
                    ],
                )
                for tooth in db.query(Teeth)
                .filter(Teeth.patient_id == id)
                .order_by(Teeth.tooth_number.asc())
                .all()
            ]

            teeth_by_number = {tooth.tooth_number: tooth for tooth in teeth}
            appointment_by_id = {item.id: item for item in appointments}

            treatment_plans = []
            for plan in (
                db.query(TreatmentPlan)
                .filter(TreatmentPlan.patient_id == id)
                .order_by(TreatmentPlan.created_at.desc())
                .all()
            ):
                tooth_numbers = parse_tooth_numbers(plan.tooth_numbers)
                plan_media = [
                    item
                    for item in media
                    if plan.appointment_id and item.appointment_id == plan.appointment_id
                ]

                treatment_plans.append(
                    PatientTreatmentPlanSummaryType(
                        id=plan.id,
                        title=plan.title,
                        diagnosis=plan.diagnosis,
                        notes=plan.notes,
                        status=plan.status,
                        tooth_numbers=tooth_numbers,
                        planned_at=plan.planned_at.isoformat() if plan.planned_at else None,
                        created_at=plan.created_at.isoformat(),
                        doctor=doctor_summary(plan.doctor),
                        service=service_summary(plan.service),
                        appointment=appointment_by_id.get(plan.appointment_id),
                        media=plan_media,
                        teeth=[
                            teeth_by_number[number]
                            for number in tooth_numbers
                            if number in teeth_by_number
                        ],
                    )
                )

            return PatientCardType(
                patient=patient_type,
                appointments=appointments,
                records=records,
                media=media,
                teeth=teeth,
                treatment_plans=treatment_plans,
            )
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
