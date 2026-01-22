import TemplatePage from './TemplatePage';
import EntityModal from '../components/EntityModal/EntityModal';
import PaginationList from '../components/PaginationList';

import {
  useGetPersonalsQuery,
  useDeletePersonalMutation,
  useUpdatePersonalMutation,
  useCreatePersonalMutation,
} from '../store/services/PersonalApi';

import { personFields } from '../components/Fields/personalField';
import { useState } from 'react';
import { Typography, notification } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Text } = Typography;

const PersonalPage = () => {
  const role = useSelector((state: any) => state.auth.role);

  const { data, isLoading } = useGetPersonalsQuery();
  const [createPersonal, { isLoading: isCreating }] = useCreatePersonalMutation();
  const [updatePersonal] = useUpdatePersonalMutation();
  const [deletePersonal] = useDeletePersonalMutation();

  const personals = data?.data?.allPersonal || [];

  const [selectedPersonal, setSelectedPersonal] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openSuccess = () =>
    api.success({
      message: 'Успешно',
      description: 'Операция выполнена успешно',
    });

  const columns = [
    {
      title: 'ФИО',
      key: 'fio',
      render: (_: any, record: any) => (
        <span>{record.name} {record.surname}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
    },
    ...(role === 'admin'
      ? [
          {
            title: 'Редактировать',
            render: (_: any, record: any) => (
              <a
                onClick={() => {
                  setSelectedPersonal({
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
          {
            title: 'Удалить',
            render: (_: any, record: any) => (
              <a onClick={() => deletePersonal(record.id)}>
                Удалить
              </a>
            ),
          },
        ]
      : []),
  ];

  const dataSource = personals.map((p: any) => ({
    key: p.id,
    ...p,
  }));

  const handleCreate = async (formData: any) => {
    const { dateOfBirth, experience, ...rest } = formData;

    await createPersonal({
      ...rest,
      experience: +experience,
      dateOfBirth: dayjs(+dateOfBirth).format('YYYY-MM-DD'),
    }).unwrap();

    openSuccess();
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    await updatePersonal({
      id: selectedPersonal.id,
      input: {
        ...formData,
        dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
      },
    }).unwrap();

    openSuccess();
    setIsEditModalOpen(false);
  };

  return (
    <TemplatePage
      title="Персонал"
      description="Управление базой данных персонала"
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
        title="Создание персонала"
        fields={personFields}
        buttonText="Создать"
        onSubmit={handleCreate}
        isLoading={isCreating}
        hasDefaultValue={false}
      />

      {/* EDIT */}
      <EntityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Редактирование персонала"
        fields={personFields}
        defaultValues={selectedPersonal}
        buttonText="Сохранить"
        onSubmit={handleEdit}
        hasDefaultValue
      />
    </TemplatePage>
  );
};

export default PersonalPage;
