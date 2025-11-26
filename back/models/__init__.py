"""
Модели базы данных для медицинской CRM
"""
from .base import Base
from .personal import Personal
from .patient import Patient
from .appointment import Appointment
from .medical_records import PatientRecords
from .allergies import Allergies, PatientAllergies
from .teeth import Teeth, TeethHistory
from .services import Categories, Service
from .media import PatientMedia

__all__ = [
    'Base',
    'Personal',
    'Patient', 
    'Appointment',
    'PatientRecords',
    'Allergies',
    'PatientAllergies',
    'Teeth',
    'TeethHistory',
    'Categories',
    'Service',
    'PatientMedia'
]