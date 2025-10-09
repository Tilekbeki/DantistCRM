import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPatients } from '../../store/slices/patientSlice';
import { Avatar, List, Tag, Space, Typography } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';

const { Text } = Typography;

const PatientsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: patients, loading } = useAppSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Шаги для статуса пациента (пример)
  const stepItems = [
    {
      title: 'Регистрация',
      description: 'Пациент зарегистрирован',
    },
    {
      title: 'Осмотр',
      description: 'Проведен первичный осмотр',
    },
    {
      title: 'Лечение',
      description: 'Назначено лечение',
    },
    {
      title: 'Выздоровление',
      description: 'Курс лечения завершен',
    },
  ];
  

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'new':
        return 'blue';
      case 'examined':
        return 'orange';
      case 'treatment':
        return 'purple';
      case 'recovered':
        return 'green';
      default:
        return 'default';
    }
  };

  // Функция для получения русского названия статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      case 'new':
        return 'Новый';
      case 'examined':
        return 'Осмотрен';
      case 'treatment':
        return 'На лечении';
      case 'recovered':
        return 'Выздоровел';
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Загрузка пациентов...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <List
        itemLayout="horizontal"
        dataSource={patients}
        loading={loading}
        renderItem={(patient, index) => (
          <List.Item
            style={{
              padding: '16px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              marginBottom: '12px',
              backgroundColor: '#fff'
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                //   src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.id}`}
                src = {`https://api.dicebear.com/7.x/miniavs/svg?seed=6`}
                  size={64}
                  icon={<UserOutlined />}
                />
              }
              title={
                <Space>
                  <a href={`/patients/${patient.id}`} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {patient.first_name} {patient.last_name}
                  </a>
                  <Tag color={getStatusColor(patient.status)}>
                    {getStatusText(patient.status)}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  <Space>
                    <CalendarOutlined />
                    <Text>Дата рождения: {new Date(patient.date_of_birth).toLocaleDateString('ru-RU')}</Text>
                  </Space>
                  
                  <Space>
                    <UserOutlined />
                    <Text>Пол: {patient.gender === 'male' ? 'Мужской' : 'Женский'}</Text>
                  </Space>
                  
                  {patient.phone_number && (
                    <Space>
                      <PhoneOutlined />
                      <Text>Телефон: {patient.phone_number}</Text>
                    </Space>
                  )}
                  
                  {patient.tgUsername && (
                    <Space>
                      <Text type="secondary">Telegram: @{patient.tgUsername}</Text>
                    </Space>
                  )}
                  
                  {patient.address && (
                    <Space>
                      <Text type="secondary">Адрес: {patient.address}</Text>
                    </Space>
                  )}
                </Space>
              }
            />
            
          </List.Item>
        )}
      />
    </div>
  );
};

export default PatientsList;