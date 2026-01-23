import { useSelector } from 'react-redux';
import { Typography, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

import TemplatePage from './TemplatePage';
import PaginationList from '../components/PaginationList';
import EntityModal from '../components/EntityModal/EntityModal';
import { appointmentFields } from '../components/Fields/appointmentFields';

import {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from '../store/services/AppointmentsApi';

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

const AppointmentsPage = () => {
  const role = useSelector((state: any) => state.auth.role);

  const patients = useSelector((state: any) => state.patients.patientsList);
  const personals = useSelector((state: any) => state.personals.personalsList);
  const services = useSelector((state: any) => state.services.servicesList);

  const { data, isLoading } = useGetAppointmentsQuery();
  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const appointments = data?.data?.allAppointments || [];

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [api, contextHolder] = notification.useNotification();

  const notifySuccess = () =>
    api.success({
      message: 'Успешно',
      description: 'Операция выполнена успешно',
    });

  // ---------- fields with options ----------
  const fieldsWithOptions = appointmentFields.map((field) => {
    if (field.name === 'patientId') {
      return {
        ...field,
        options: Object.values(patients).map((p: any) => ({
          label: `${p.name} ${p.surname}`,
          value: p.id,
        })),
      };
    }

    if (field.name === 'doctorId') {
      return {
        ...field,
        options: Object.values(personals).map((d: any) => ({
          label: `${d.name} ${d.surname}`,
          value: d.id,
        })),
      };
    }

    if (field.name === 'serviceId') {
      return {
        ...field,
        options: Object.values(services).map((s: any) => ({
          label: s.name,
          value: s.id,
        })),
      };
    }

    return field;
  });

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
      dataIndex: 'visitDate',
      render: (v: string) =>
        v ? dayjs(v).format('DD.MM.YYYY HH:mm') : <Text type="secondary">—</Text>,
    },
    {
      title: 'Услуга',
      render: (_: any, record) =>
        services[record.serviceId]?.name || <Text type="secondary">—</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (v: string) => {
        if (v === 'planned') return 'Запланирован';
        if (v === 'done') return 'Завершён';
        if (v === 'cancelled') return 'Отменён';
        return '—';
      },
    },
    {
      title: 'Редактировать',
      render: (_: any, record: any) => (
        <a
          onClick={() => {
            setSelectedAppointment({
              ...record,
              visitDate: dayjs(record.visitDate),
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
              <a onClick={() => deleteAppointment(record.id)}>Удалить</a>
            ),
          },
        ]
      : []),
  ];

  // ---------- data ----------
  const dataSource = appointments.map((a: IAppointment) => ({
    key: a.id,
    ...a,
  }));

  // ---------- handlers ----------
  const handleCreate = async (formData: any) => {
    await createAppointment({
      ...formData,
      visitDate: dayjs(+formData.visitDate).toISOString(),
    }).unwrap();

    notifySuccess();
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    await updateAppointment({
      id: selectedAppointment.id,
      input: {
        ...formData,
        visitDate: dayjs(+formData.visitDate).toISOString(),
      },
    }).unwrap();

    notifySuccess();
    setIsEditModalOpen(false);
  };

  return (
    <TemplatePage
      title="Приёмы"
      description="Управление записями приёмов"
      toggleModalState={() => setIsCreateModalOpen(true)}
    >
      {contextHolder}

      <PaginationList
        entities={dataSource}
        columns={columns}
        loading={isLoading}
        pageSize={8}
      />

      {/* CREATE */}
      <EntityModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Создание приёма"
        fields={fieldsWithOptions}
        buttonText="Создать"
        onSubmit={handleCreate}
        isLoading={isCreating}
        hasDefaultValue={false}
      />

      {/* EDIT */}
      <EntityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Редактирование приёма"
        fields={fieldsWithOptions}
        defaultValues={selectedAppointment}
        buttonText="Сохранить изменения"
        onSubmit={handleEdit}
        hasDefaultValue
      />
    </TemplatePage>
  );
};

export default AppointmentsPage;
