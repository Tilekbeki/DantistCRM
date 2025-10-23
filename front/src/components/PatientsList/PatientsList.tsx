import { useAppSelector } from '../../store/hooks';
import { Table, Tag, Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CreateAppointmentModal from '../CreateAppointmentModal/CreateAppointmentModal';
import BaseAdminModal from '../../ui/ModalWindow/ModalWindow';
const { Text } = Typography;

interface PatientType {
  key: React.Key;
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
  gender: string;
  phone_number?: string;
  tgUsername?: string;
  address?: string;
  status: string;
}

const PatientsList: React.FC = () => {
  const { items: patients, loading } = useAppSelector((state) => state.patients);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalState = (state) => {
    console.log('clicked');
    setIsModalOpen(state);
  };

  const handleOk = (data) => {
    console.log(data)
    setIsModalOpen(false)
  };
  const handleCancel = () => setIsModalOpen(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'new': return 'blue';
      case 'examined': return 'orange';
      case 'treatment': return 'purple';
      case 'recovered': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'inactive': return 'Неактивен';
      case 'new': return 'Новый';
      case 'examined': return 'Осмотрен';
      case 'treatment': return 'На лечении';
      case 'recovered': return 'Выздоровел';
      default: return status;
    }
  };

  const columns: TableColumnsType<PatientType> = [
    {
      title: 'Имя',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (_, record) => (
        <a href={`/patients/${record.id}`} className="font-semibold text-blue-600 hover:underline">
          {record.firstName} {record.lastName}
        </a>
      ),
    },
    {
      title: 'Дата создания',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (_, record) => new Date(record.createdAt).toLocaleDateString('ru-RU'),
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (gender === 'male' ? 'Мужской' : 'Женский'),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (phone?: string) => phone || <Text type="secondary">—</Text>,
    },
    {
      title: 'Telegram',
      dataIndex: 'tgUsername',
      key: 'tgUsername',
      render: (tg?: string) => tg ? <Text>@{tg}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      render: (address?: string) => address ? <Text>{address}</Text> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Удалить',
      dataIndex: '',
      key: 'delete',
      render: () => <a>Удалить</a>,
    },
    {
      title: 'Записать на прием',
      dataIndex: '',
      key: 'appointment',
      render: () => <a onClick={toggleModalState}>Записать</a>,
    },
  ];

  const data: PatientType[] = patients.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
    <>
      <Table<PatientType>
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
        expandable={{
          expandedRowRender: (record) => (
            <div className="p-3 bg-gray-50 rounded-md">
              <Space direction="vertical">
                <Space>
                  <CalendarOutlined />
                  <Text>Дата создания: {new Date(record.createdAt).toLocaleDateString('ru-RU')}</Text>
                </Space>
                {record.phone_number && (
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
                )}
              </Space>
            </div>
          ),
        }}
      />

      {/* 👉 Модалка должна быть здесь, не внутри таблицы */}
      <CreateAppointmentModal 
         open = {isModalOpen}
  onOpenChange={toggleModalState}
  onSubmit={handleOk}
  information={{userId:2, patientId:3}}
      />
    </>
  );
};

export default PatientsList;
