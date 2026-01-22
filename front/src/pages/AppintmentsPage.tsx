import { useSelector } from 'react-redux';
import { Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';

import TemplatePage from './TemplatePage';
import PaginationList from '../components/PaginationList';

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

const AppintmentsPage = () => {
  const appointments = useSelector((state: any) => state.appointments.appointmentsList);
  const patients = useSelector((state: any) => state.patients.patientsList);
  const personals = useSelector((state: any) => state.personals.personalsList);
  const services = useSelector((state: any) => state.services.servicesList);

  // ---------- columns ----------
  const columns: TableColumnsType<IAppointment> = [
    {
      title: 'Пациент',
      render: (_: any, record) => {
        const patient = patients[record.patientId];
        return patient ? (
          <a href={`/patients/${record.patientId}`}>
            {patient.name} {patient.surname}
          </a>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: 'Врач',
      render: (_: any, record) => {
        const doctor = personals[record.doctorId];
        return doctor ? (
          <a href={`/doctors/${record.doctorId}`}>
            {doctor.name} {doctor.surname}
          </a>
        ) : (
          <Text type="secondary">—</Text>
        );
      },
    },
    {
      title: 'Дата приёма',
      render: (_: any, record) =>
        record.visitDate
          ? dayjs(record.visitDate).format('DD.MM.YYYY HH:mm')
          : <Text type="secondary">—</Text>,
    },
    {
      title: 'Услуга',
      render: (_: any, record) => {
        const service = services[record.serviceId];
        return service?.name || <Text type="secondary">—</Text>;
      },
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: 'Удалить',
      render: () => <a>Удалить</a>,
    },
  ];

  // ---------- data ----------
  const dataSource = appointments.map((a: IAppointment) => ({
    key: a.id,
    ...a,
  }));

  return (
    <TemplatePage title="Приёмы" description="Управление записями приёмов">
      <PaginationList
        entities={dataSource}
        columns={columns}
        pageSize={8}
      />
    </TemplatePage>
  );
};

export default AppintmentsPage;
