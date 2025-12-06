import PatientsList from '../components/PatientsList';
import TemplatePage from './TemplatePage';
import { useState } from 'react';
import EntityModal from '../components/EntityModal/EntityModal';
import { patientFields } from '../components/Fields/patientFields';
import { useCreatePatientMutation } from '../store/services/PatientApi';
import dayjs from 'dayjs';

const PatientsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createPatient, { isLoading, error }] = useCreatePatientMutation();

  const toggleModalState = () => {
    console.log('clicked');
    setIsModalOpen(!isModalOpen);
  };

  const handleOk = async (data: any) => {
    console.log('Данные для создания пациента:', data);

    try {
      const patientData = {
        name: data.name || '',
        surname: data.surname || '',
        patronymic: data.patronymic || '',
        email: data.email || '',
        gender: data.gender || 'MALE',
        phoneNumber: data.phoneNumber || data.phone_number || '',
        tg: data.tg || '',
        dateOfBirth: data.dateOfBirth || data.date_of_birth || null,
      };

      console.log('Отправляемые данные:', patientData);

      const result = await createPatient({
        ...patientData,
        dateOfBirth: dayjs(+patientData.dateOfBirth).format('YYYY-MM-DD'),
      }).unwrap();

      console.log('Результат создания пациента:', result);

      if (result.data?.createPatient?.success) {
        setIsModalOpen(false);
        alert('Пациент успешно создан!');
      } else {
        alert(`Ошибка: ${result.data?.createPatient?.message || 'Неизвестная ошибка'}`);
      }
    } catch (err) {
      console.error('Ошибка при создании пациента:', err);
      alert('Произошла ошибка при создании пациента');
    }
  };

  return (
    <TemplatePage title="Пациенты" description="Управление базой данных пациентов" toggleModalState={toggleModalState}>
      <PatientsList />
      <EntityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Создание пациента"
        fields={patientFields}
        buttonText="Создать"
        onSubmit={handleOk}
        isLoading={isLoading}
      />
    </TemplatePage>
  );
};

export default PatientsPage;
