import TemplatePage from './TemplatePage';
import PaginationList from '../components/PaginationList';
import EntityModal from '../components/EntityModal/EntityModal';
import { patientFields } from '../components/Fields/patientFields';

import {
  useGetPatientsQuery,
  useDeletePatientMutation,
  useUpdatePatientMutation,
  useCreatePatientMutation,
} from '../store/services/PatientApi';

import { Typography, notification } from 'antd';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Text } = Typography;

const PatientsPage = () => {
  const role = useSelector((state: any) => state.auth.role);

  const { data, isLoading } = useGetPatientsQuery();
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();

  const patients = data?.data?.allPatients || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [api, contextHolder] = notification.useNotification();

  const notifySuccess = () =>
    api.success({
      message: 'Успешно',
      description: 'Операция выполнена успешно',
    });

  // ---------- columns ----------
  const columns = [
    {
      title: 'Имя',
      render: (_: any, record: any) => (
        <a href={`/patients/${record.id}`}>
          {record.name} {record.surname}
        </a>
      ),
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      render: (date: any) =>
        date ? dayjs(date).format('DD.MM.YYYY') : <Text type="secondary">—</Text>,
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      render: (v: string) => (v === 'male' ? 'Мужской' : 'Женский'),
    },
    {
      title: 'Телефон',
      dataIndex: 'phoneNumber',
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: 'Редактировать',
      render: (_: any, record: any) => (
        <a
          onClick={() => {
            setSelectedPatient({
              ...record,
              dateOfBirth: dayjs(record.dateOfBirth),
            });
            setIsEditModalOpen(true);
          }}
        >
          Редактировать
        </a>
      ),
    },
    ...(role === 'admin'
      ? [
          {
            title: 'Удалить',
            render: (_: any, record: any) => (
              <a onClick={() => deletePatient(record.id)}>Удалить</a>
            ),
          },
        ]
      : []),
  ];

  // ---------- data ----------
  const dataSource = patients.map((p: any) => ({
    key: p.id,
    ...p,
  }));

  // ---------- handlers ----------
  const handleCreate = async (formData: any) => {
    await createPatient({
      ...formData,
      dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
    }).unwrap();

    notifySuccess();
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    await updatePatient({
      id: selectedPatient.id,
      input: {
        ...formData,
        dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
      },
    }).unwrap();

    notifySuccess();
    setIsEditModalOpen(false);
  };

  return (
    <TemplatePage
      title="Пациенты"
      description="Управление базой данных пациентов"
      toggleModalState={() => setIsCreateModalOpen(true)}
    >
      {contextHolder}

      <PaginationList
        entities={dataSource}
        columns={columns}
        loading={isLoading}
      />

      {/* CREATE */}
      <EntityModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Создание пациента"
        fields={patientFields}
        buttonText="Создать"
        onSubmit={handleCreate}
        isLoading={isCreating}
        hasDefaultValue={false}
      />

      {/* EDIT */}
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
