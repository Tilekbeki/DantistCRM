import { Table, notification, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useState, useEffect } from 'react'; // Добавлен useEffect
import {
  useGetPatientsQuery,
  useDeletePatientMutation,
  useUpdatePatientMutation,
} from '../../store/services/PatientApi';
const { Text } = Typography;
import { patientFields } from '../Fields/patientFields';
import EntityModal from '../EntityModal/EntityModal';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

type NotificationType = 'success';

interface PatientType {
  key: React.Key;
  id: number;
  name: string;
  surname: string;
  createdAt: string;
  gender: string;
  phoneNumber?: string;
  tg?: string;
  email?: string;
  dateOfBirth: string | any;
}

interface formData extends PatientType {
  dateOfBirth: string;
}

const PatientsList: React.FC = () => {
  const { data: patientsData, isLoading } = useGetPatientsQuery();
  const [deletePatient] = useDeletePatientMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const patients = patientsData?.data?.allPatients || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientType | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const role = useSelector(state=>state.auth.role)

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      title: 'Success!',
      description: 'Обновление произошло успешно!',
    });
  };

  const openEditModal = (patient: PatientType) => {
    setSelectedPatient({
      ...patient,
      dateOfBirth: dayjs(patient.dateOfBirth),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedPatient(null);
    }
  }, [isModalOpen]);

  const handleSubmit = (formData: formData) => {
    console.log(formData.dateOfBirth, 'дата', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    const formattedData = {
      ...formData,
      dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
    };

    console.log('Updated data:', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    updatePatient({
      id: selectedPatient?.id,
      input: formattedData,
    })
      .unwrap()
      .then(() => {
        openNotificationWithIcon('success');
      })
      .catch((error) => {
        console.error('Ошибка при обновлении:', error);
      });

    handleModalClose();
  };

  const columns: TableColumnsType<PatientType> = [
    {
      title: 'Имя',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (_, record) => (
        <a href={`/patients/${record.id}`}>
          {record.name} {record.surname}
        </a>
      ),
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => {
        if (!date) return '—';
        const dateObj = typeof date === 'number' ? dayjs(date) : dayjs(date);
        return dateObj.isValid() ? dateObj.format('DD.MM.YYYY') : '—';
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      render: (_, record) => (record.gender === 'male' ? 'Мужской' : 'Женский'),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phoneNumber',
      render: (_, record) => record.phoneNumber || <Text type="secondary">—</Text>,
    },
    {
      title: 'Редактировать',
      key: 'edit',
      render: (_, record) => (
        <a key={`link-${record.id}`} onClick={() => openEditModal(record)} style={{ cursor: 'pointer' }}>
          Редактировать
        </a>
      ),
    },
    ...(role === 'admin' ? [{
      title: 'Удалить',
      key: 'delete',
      render: (_, record) => (
        <a
          onClick={() => {
            deletePatient(record.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          Удалить
        </a>
      ),
    }] : []),
  ];

  const data: PatientType[] = patients.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
    <>
      {contextHolder}
      <Table columns={columns} dataSource={data} loading={isLoading} pagination={{ pageSize: 8 }} rowKey="id" style={{width:'100%'}}/>

      <EntityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Редактирование пациента"
        fields={patientFields}
        defaultValues={selectedPatient || {}}
        buttonText="Сохранить изменения"
        onSubmit={handleSubmit}
        key={selectedPatient?.id || 'modal'}
      />
    </>
  );
};

export default PatientsList;
