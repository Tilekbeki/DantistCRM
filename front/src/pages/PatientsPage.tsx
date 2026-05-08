import { Button, Space, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import EntityModal from '../components/EntityModal/EntityModal';
import { patientFields } from '../components/Fields/patientFields';
import PaginationList from '../components/PaginationList';
import {
  useCreatePatientMutation,
  useDeletePatientMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
} from '../store/services/PatientApi';
import TemplatePage from './TemplatePage';

const { Text } = Typography;

const PatientsPage = () => {
  const role = useSelector((state: any) => state.auth.role);

  const { data, isLoading } = useGetPatientsQuery();
  const [createPatient] = useCreatePatientMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [api, contextHolder] = notification.useNotification();

  const patients = data?.data?.allPatients || [];

  const notifySuccess = () =>
    api.success({
      message: 'Успешно',
      description: 'Операция выполнена успешно',
    });

  const columns = [
    {
      title: 'Пациент',
      render: (_: unknown, record: any) => (
        <Space direction="vertical" size={0}>
          <Link to={`/patients/${record.id}`}>
            {record.surname} {record.name} {record.patronymic}
          </Link>
          <Text type="secondary">Карточка пациента</Text>
        </Space>
      ),
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      render: (date: string) => (date ? dayjs(date).format('DD.MM.YYYY') : <Text type="secondary">-</Text>),
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      render: (value: string) => (value === 'male' ? 'Мужской' : 'Женский'),
    },
    {
      title: 'Телефон',
      dataIndex: 'phoneNumber',
      render: (value: string) => value || <Text type="secondary">-</Text>,
    },
    {
      title: 'Карточка',
      render: (_: unknown, record: any) => (
        <Link to={`/patients/${record.id}`}>
          <Button type="primary">Открыть</Button>
        </Link>
      ),
    },
    {
      title: 'Редактировать',
      render: (_: unknown, record: any) => (
        <Button
          onClick={() => {
            setSelectedPatient({
              ...record,
              dateOfBirth: record.dateOfBirth ? dayjs(record.dateOfBirth) : undefined,
            });
            setIsEditModalOpen(true);
          }}
        >
          Редактировать
        </Button>
      ),
    },
    ...(role === 'admin'
      ? [
          {
            title: 'Удалить',
            render: (_: unknown, record: any) => (
              <Button danger onClick={() => deletePatient(record.id)}>
                Удалить
              </Button>
            ),
          },
        ]
      : []),
  ];

  const dataSource = patients.map((patient) => ({
    key: patient.id,
    ...patient,
  }));

  const normalizeBirthDate = (value: unknown) => {
    if (!value) return undefined;
    return dayjs(value as any).format('YYYY-MM-DD');
  };

  const handleCreate = async (formData: any) => {
    await createPatient({
      ...formData,
      dateOfBirth: normalizeBirthDate(formData.dateOfBirth),
    }).unwrap();

    notifySuccess();
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    await updatePatient({
      id: selectedPatient.id,
      input: {
        ...formData,
        dateOfBirth: normalizeBirthDate(formData.dateOfBirth),
      },
    }).unwrap();

    notifySuccess();
    setIsEditModalOpen(false);
  };

  return (
    <TemplatePage
      title="Пациенты"
      description="База пациентов и быстрый переход в медицинскую карту"
      toggleModalState={() => setIsCreateModalOpen(true)}
    >
      {contextHolder}

      <PaginationList entities={dataSource} columns={columns} loading={isLoading} />

      <EntityModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Создание пациента"
        fields={patientFields}
        buttonText="Создать"
        onSubmit={handleCreate}
        hasDefaultValue={false}
      />

      <EntityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Редактирование пациента"
        fields={patientFields}
        defaultValues={selectedPatient}
        buttonText="Сохранить изменения"
        onSubmit={handleEdit}
        hasDefaultValue
      />
    </TemplatePage>
  );
};

export default PatientsPage;
