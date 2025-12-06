import { Table, Tag, Space, Typography, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  useGetPersonalsQuery,
  useDeletePersonalMutation,
  useUpdatePersonalMutation,
} from '../../store/services/PersonalApi';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { personFields } from '../Fields/personalField';
import EntityModal from '../EntityModal/EntityModal';

const { Text } = Typography;

interface IPersonal {
  key: React.Key;
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  role: string;
  tg: string;
  email: string;
  dateOfBirth: string;
}

const PersonalList: React.FC = () => {
  const [selectedPersonal, setSelectedPersonal] = useState<IPersonal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: personalsData, isLoading, error } = useGetPersonalsQuery();
  const [deletePersonal] = useDeletePersonalMutation();
  const [updatePersonal] = useUpdatePersonalMutation();
  const personals = personalsData?.data?.allPersonal || [];

  type NotificationType = 'success';

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      title: 'Success!',
      description: 'Обновление произошло успешно!',
    });
  };

  const openEditModal = (personal: IPersonal) => {
    setSelectedPersonal({
      ...personal,
      dateOfBirth: dayjs(personal.dateOfBirth),
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPersonal(null);
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedPersonal(null);
    }
  }, [isModalOpen]);

  const handleSubmit = (formData: formData) => {
    console.log(formData.dateOfBirth, 'дата', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    const formattedData = {
      ...formData,
      dateOfBirth: dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'),
    };

    console.log('Updated data:', dayjs(+formData.dateOfBirth).format('YYYY-MM-DD'));

    updatePersonal({
      id: selectedPersonal?.id,
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

  const columns: TableColumnsType<IPersonal> = [
    {
      title: 'ФИО',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (_, record) => (
        <a href={`/patients/${record.id}`} className="font-semibold text-blue-600 hover:underline">
          {record.name} {record.surname}
        </a>
      ),
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => record.email || <Text type="secondary">—</Text>,
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (_, record) => record.phoneNumber || <Text type="secondary">—</Text>,
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => record.role || <Text type="secondary">—</Text>,
    },
    {
      title: 'Telegram',
      dataIndex: 'tgUsername',
      key: 'tgUsername',
      render: (_, record) => (record.tg ? <Text>{record.tg}</Text> : <Text type="secondary">—</Text>),
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
    {
      title: 'Удалить',
      dataIndex: '',
      key: 'delete',
      render: (_, record) => <a onClick={() => deletePersonal(record.id)}>Удалить</a>,
    },
  ];

  const data: IPersonal[] = personals.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
    <>
      <Table<IPersonal>
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={{ pageSize: 16 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-3 bg-gray-50 rounded-md">
              <Space direction="vertical">
                {/* <Space>
                  <CalendarOutlined />
                  <Text>Дата создания: {new Date(record.createdAt).toLocaleDateString('ru-RU')}</Text>
                </Space> */}
                {/* {record.phone_number && (
                  <Space>
                    <PhoneOutlined />
                    <Text>Телефон: {record.phone_number}</Text>
                  </Space>
                )}
                {record.tgUsername && (
                  <Space>
                    <Text type="secondary">Telegram: @{record.tgUsername}</Text>
                  </Space>
                )}
                {record.address && (
                  <Space>
                    <Text type="secondary">Адрес: {record.address}</Text>
                  </Space>
                )} */}
              </Space>
            </div>
          ),
        }}
      />
      <EntityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Редактирование персонала"
        fields={personFields}
        defaultValues={selectedPersonal || {}}
        buttonText="Сохранить изменения"
        onSubmit={handleSubmit}
        key={setSelectedPersonal?.id || 'modal'}
        hasDefaultValue={true}
      />
    </>
  );
};

export default PersonalList;
