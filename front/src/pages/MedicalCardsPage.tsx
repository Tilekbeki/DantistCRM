import { Button, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import PaginationList from '../components/PaginationList';
import TemplatePage from './TemplatePage';
import { useGetPatientsQuery } from '../store/services/PatientApi';

const { Text } = Typography;

const MedicalCardsPage = () => {
  const { data, isLoading } = useGetPatientsQuery();
  const patients = data?.data?.allPatients || [];

  const columns = [
    {
      title: 'Пациент',
      render: (_: unknown, record: any) => (
        <Space direction="vertical" size={0}>
          <Link to={`/medicalcards/${record.id}`}>
            {record.surname} {record.name} {record.patronymic}
          </Link>
          <Text type="secondary">{record.phoneNumber || 'Телефон не указан'}</Text>
        </Space>
      ),
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      render: (date: string) => (date ? dayjs(date).format('DD.MM.YYYY') : <Text type="secondary">-</Text>),
    },
    {
      title: 'Контакты',
      render: (_: unknown, record: any) => (
        <Space direction="vertical" size={0}>
          <Text>{record.email || 'Email не указан'}</Text>
          <Text type="secondary">{record.tg || 'Telegram не указан'}</Text>
        </Space>
      ),
    },
    {
      title: 'Карточка',
      render: (_: unknown, record: any) => (
        <Link to={`/medicalcards/${record.id}`}>
          <Button type="primary">Открыть</Button>
        </Link>
      ),
    },
  ];

  const dataSource = patients.map((patient) => ({
    key: patient.id,
    ...patient,
  }));

  return (
    <TemplatePage
      title="Медицинские карты"
      description="Единый вход в карточку пациента, планы лечения, снимки и историю по зубам"
    >
      <PaginationList entities={dataSource} columns={columns} loading={isLoading} />
    </TemplatePage>
  );
};

export default MedicalCardsPage;
