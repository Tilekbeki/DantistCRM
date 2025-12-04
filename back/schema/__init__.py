# schema/__init__.py
"""
GraphQL схемы для медицинской CRM
"""
from .personal_schema import PersonalQuery, PersonalMutation
from .patient_schema import PatientQuery, PatientMutation
from .appointment_schema import AppointmentQuery, AppointmentMutation
from .allergies_schema import AllergiesQuery, AllergiesMutation
from .teeth_schema import TeethQuery, TeethMutation
from .services_schema import ServicesQuery, ServicesMutation
from .media_schema import MediaQuery, MediaMutation
from .auth_schema import AuthQuery, AuthMutation  # Добавляем импорт

__all__ = [
    'PersonalQuery', 'PersonalMutation',
    'PatientQuery', 'PatientMutation', 
    'AppointmentQuery', 'AppointmentMutation',
    'AllergiesQuery', 'AllergiesMutation',
    'TeethQuery', 'TeethMutation',
    'ServicesQuery', 'ServicesMutation', 
    'MediaQuery', 'MediaMutation',
    'AuthQuery', 'AuthMutation'  # Добавляем в экспорт
]