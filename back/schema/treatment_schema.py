import strawberry
from datetime import datetime
from typing import List, Optional

from database import SessionLocal
from models.treatment import TreatmentPlan
from .base import QueryResult


@strawberry.input
class TreatmentPlanInput:
    patient_id: int
    doctor_id: int
    title: str
    service_id: Optional[int] = None
    appointment_id: Optional[int] = None
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = "planned"
    tooth_numbers: Optional[List[int]] = None
    planned_at: Optional[str] = None


@strawberry.type
class TreatmentPlanType:
    id: int
    patient_id: int
    doctor_id: int
    service_id: Optional[int]
    appointment_id: Optional[int]
    title: str
    diagnosis: Optional[str]
    notes: Optional[str]
    status: str
    tooth_numbers: List[int]
    planned_at: Optional[str]
    created_at: str


def parse_tooth_numbers(value: Optional[str]) -> List[int]:
    if not value:
        return []

    result = []
    for item in value.split(","):
        try:
            result.append(int(item))
        except ValueError:
            continue
    return result


def serialize_treatment_plan(plan: TreatmentPlan) -> TreatmentPlanType:
    return TreatmentPlanType(
        id=plan.id,
        patient_id=plan.patient_id,
        doctor_id=plan.doctor_id,
        service_id=plan.service_id,
        appointment_id=plan.appointment_id,
        title=plan.title,
        diagnosis=plan.diagnosis,
        notes=plan.notes,
        status=plan.status,
        tooth_numbers=parse_tooth_numbers(plan.tooth_numbers),
        planned_at=plan.planned_at.isoformat() if plan.planned_at else None,
        created_at=plan.created_at.isoformat(),
    )


@strawberry.type
class TreatmentQuery:
    @strawberry.field
    def treatment_plans(self, patient_id: Optional[int] = None) -> List[TreatmentPlanType]:
        db = SessionLocal()
        try:
            query = db.query(TreatmentPlan)
            if patient_id:
                query = query.filter(TreatmentPlan.patient_id == patient_id)

            plans = query.order_by(TreatmentPlan.created_at.desc()).all()
            return [serialize_treatment_plan(plan) for plan in plans]
        finally:
            db.close()


@strawberry.type
class TreatmentMutation:
    @strawberry.mutation
    def create_treatment_plan(self, input: TreatmentPlanInput) -> QueryResult:
        db = SessionLocal()
        try:
            planned_at = None
            if input.planned_at:
                planned_at = datetime.fromisoformat(input.planned_at)

            plan = TreatmentPlan(
                patient_id=input.patient_id,
                doctor_id=input.doctor_id,
                service_id=input.service_id,
                appointment_id=input.appointment_id,
                title=input.title,
                diagnosis=input.diagnosis,
                notes=input.notes,
                status=input.status or "planned",
                tooth_numbers=",".join(str(item) for item in (input.tooth_numbers or [])),
                planned_at=planned_at,
            )
            db.add(plan)
            db.commit()
            db.refresh(plan)
            return QueryResult(success=True, message="План лечения создан", data=plan.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()
