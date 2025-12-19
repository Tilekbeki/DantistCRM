import { useSelector } from 'react-redux';
import { Table, Tag, Space, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import { useGetAppointmentsQuery } from '../../store/services/AppointmentsApi';
import dayjs from 'dayjs';
const { Text } = Typography;

interface IAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  visitDate: string;
  createdAt: string;
  status: string;
}



const AppintmentList: React.FC = () => {
  const { data: appointmentsData, isLoading }  = useGetAppointmentsQuery()
  const appointments = appointmentsData?.data?.allAppointments || [];
  const patients = useSelector(store=>store.patients.patientsList);
  const personals = useSelector(store=>store.personals.personalsList);
  const services = useSelector(store=>store.services.servicesList);

console.log(personals)
  const columns: TableColumnsType<IAppointment> = [
    {
      title: 'Пациент',
      dataIndex: 'first_name',
      key: 'patient_name',
      render: (_, record) => (
        <a href={`/patients/${record.id}`} className="font-semibold text-blue-600 hover:underline">
          {patients[record.patientId].name} {patients[record.patientId].surname}
        </a>
      ),
    },
    {
      title: 'Врач',
      dataIndex: 'personal',
      key: 'personal',
      render: (_, record) =>(
        <a href={`/doctors/${record.id}`} className="font-semibold text-blue-600 hover:underline">
          {personals[record.doctorId].name} {personals[record.doctorId].surname}
        </a>
      ),
    },
    {
      title: 'Дата приема',
      dataIndex: 'phone_number',
      key: 'phone_number',
      render: (_, record) => dayjs(record.visitDate).format('DD.MM.YYYY HH:MM') || <Text type="secondary">—</Text>,
    },
    {
      title: 'Услуга',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => `${services[record.serviceId].name}` || <Text type="secondary">—</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'occupation',
      key: 'occupation',
      render: (_, record) => record.status || <Text type="secondary">—</Text>,
    },
    {
      title: 'Удалить',
      dataIndex: '',
      key: 'x',
      render: () => <a>Удалить</a>,
    },
  ];

  const data: IAppointment[] = appointments.map((p) => ({
    key: p.id,
    ...p,
  }));

  return (
    <Table<IAppointment>
      columns={columns}
      dataSource={data}
      loading={isLoading}
      pagination={{ pageSize: 8 }}
      expandable={{
        expandedRowRender: (record) => (
          <div className="p-3 bg-gray-50 rounded-md">
            {/* <Space direction="vertical">
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
            </Space> */}
          </div>
        ),
      }}
    />
  );
};

export default AppintmentList;
