# schema/__init__.py
"""GraphQL schemas for Dantist CRM."""

from .allergies_schema import AllergiesMutation, AllergiesQuery
from .appointment_schema import AppointmentMutation, AppointmentQuery
from .auth_schema import AuthMutation, AuthQuery
from .media_schema import MediaMutation, MediaQuery
from .patient_schema import PatientMutation, PatientQuery
from .personal_schema import PersonalMutation, PersonalQuery
from .services_schema import ServicesMutation, ServicesQuery
from .teeth_schema import TeethMutation, TeethQuery
from .treatment_schema import TreatmentMutation, TreatmentQuery

__all__ = [
    "PersonalQuery",
    "PersonalMutation",
    "PatientQuery",
    "PatientMutation",
    "AppointmentQuery",
    "AppointmentMutation",
    "AllergiesQuery",
    "AllergiesMutation",
    "TeethQuery",
    "TeethMutation",
    "ServicesQuery",
    "ServicesMutation",
    "MediaQuery",
    "MediaMutation",
    "TreatmentQuery",
    "TreatmentMutation",
    "AuthQuery",
    "AuthMutation",
]
