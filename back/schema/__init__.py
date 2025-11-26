"""
GraphQL схемы для медицинской CRM
"""
from .personal_schema import PersonalQuery, PersonalMutation
from .patient_schema import PatientQuery, PatientMutation
from .appointment_schema import AppointmentQuery, AppointmentMutation
from .medical_records_schema import MedicalRecordsQuery, MedicalRecordsMutation
from .allergies_schema import AllergiesQuery, AllergiesMutation
from .teeth_schema import TeethQuery, TeethMutation
from .services_schema import ServicesQuery, ServicesMutation
from .media_schema import MediaQuery, MediaMutation

__all__ = [
    'PersonalQuery', 'PersonalMutation',
    'PatientQuery', 'PatientMutation', 
    'AppointmentQuery', 'AppointmentMutation',
    'MedicalRecordsQuery', 'MedicalRecordsMutation',
    'AllergiesQuery', 'AllergiesMutation',
    'TeethQuery', 'TeethMutation',
    'ServicesQuery', 'ServicesMutation', 
    'MediaQuery', 'MediaMutation'
]