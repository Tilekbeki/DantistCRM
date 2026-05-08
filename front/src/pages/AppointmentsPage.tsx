import { Button, Space, Tag, Typography, notification } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import EntityModal from '../components/EntityModal/EntityModal';
import { appointmentFields } from '../components/Fields/appointmentFields';
import PaginationList from '../components/PaginationList';
import {
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsQuery,
  useUpdateAppointmentMutation,
} from '../store/services/AppointmentsApi';
import { useGetPatientsQuery } from '../store/services/PatientApi';
import { useGetPersonalsQuery } from '../store/services/PersonalApi';
import { useGetServicesQuery } from '../store/services/ServiceApi';
import TemplatePage from './TemplatePage';

const { Text } = Typography;

type AppointmentStatus = 'planned' | 'done' | 'cancelled';

interface AppointmentRow {
  key: number;
  id: number;
  patientId: number;
  doctorId: number;
  serviceId?: number;
  visitDate: string;
  createdAt: string;
  status: AppointmentStatus;
  patient?: {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    phoneNumber?: string;
  };
  doctor?: {
    id: number;
    name: string;
    surname: string;
    patronymic?: string;
    role?: string;
  };
  service?: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

const statusView: Record<string, { label: string; color: string }> = {
  planned: { label: 'Запланирован', color: 'blue' },
  done: { label: 'Завершен', color: 'green' },
  cancelled: { label: 'Отменен', color: 'red' },
  canceled: { label: 'Отменен', color: 'red' },
};

const fullName = (person?: { name?: string; surname?: string; patronymic?: string }) =>
  [person?.surname, person?.name, person?.patronymic].filter(Boolean).join(' ') || 'Не указан';

const normalizeDateTime = (value: unknown) => dayjs(value as any).toISOString();

const AppointmentsPage = () => {
  const role = useSelector((state: any) => state.auth.role);
  const [api, contextHolder] = notification.useNotification();

  const { data, isLoading } = useGetAppointmentsQuery();
  const { data: patientsData } = useGetPatientsQuery();
  const { data: personalsData } = useGetPersonalsQuery();
  const { data: servicesData } = useGetServicesQuery();

  const [createAppointment] = useCreateAppointmentMutation();
  const [updateAppointment] = useUpdateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  const appointments = data?.data?.allAppointments || [];

  const fieldsWithOptions = useMemo(
    () =>
      appointmentFields.map((field) => {
        if (field.name === 'patientId') {
          return {
            ...field,
            options: (patientsData?.data?.allPatients || []).map((patient) => ({
              label: fullName(patient),
              value: patient.id,
            })),
          };
        }

        if (field.name === 'doctorId') {
          return {
            ...field,
            options: (personalsData?.data?.allPersonal || []).map((doctor) => ({
              label: fullName(doctor),
              value: doctor.id,
            })),
          };
        }

        if (field.name === 'serviceId') {
          return {
            ...field,
            options: (servicesData?.data?.allServices || []).map((service) => ({
              label: service.name,
              value: service.id,
            })),
          };
        }

        return field;
      }),
    [patientsData, personalsData, servicesData],
  );

  const columns: TableColumnsType<AppointmentRow> = [
    {
      title: 'Пациент',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Link to={`/patients/${record.patientId}`}>{fullName(record.patient)}</Link>
          <Text type="secondary">{record.patient?.phoneNumber || 'Телефон не указан'}</Text>
        </Space>
      ),
    },
    {
      title: 'Врач',
      render: (_, record) => fullName(record.doctor),
    },
    {
      title: 'Дата приема',
      dataIndex: 'visitDate',
      render: (value: string) =>
        value ? dayjs(value).format('DD.MM.YYYY HH:mm') : <Text type="secondary">-</Text>,
    },
    {
      title: 'Услуга',
      render: (_, record) => record.service?.name || <Text type="secondary">Не выбрана</Text>,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      render: (value: string) => {
        const status = statusView[value] || { label: value || '-', color: 'default' };
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: 'Действия',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedAppointment({
                ...record,
                visitDate: record.visitDate ? (dayjs(record.visitDate) as any) : record.visitDate,
              });
              setIsEditModalOpen(true);
            }}
          >
            Редактировать
          </Button>
          {role === 'admin' ? (
            <Button danger onClick={() => deleteAppointment(record.id)}>
              Удалить
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  const dataSource: AppointmentRow[] = appointments.map((appointment) => ({
    key: appointment.id,
    ...appointment,
  }));

  const notifySuccess = () =>
    api.success({
      message: 'Успешно',
      description: 'Операция выполнена успешно',
    });

  const handleCreate = async (formData: any) => {
    await createAppointment({
      ...formData,
      visitDate: normalizeDateTime(formData.visitDate),
    }).unwrap();

    notifySuccess();
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    if (!selectedAppointment) return;

    await updateAppointment({
      id: selectedAppointment.id,
      input: {
        ...formData,
        visitDate: normalizeDateTime(formData.visitDate),
      },
    }).unwrap();

    notifySuccess();
    setIsEditModalOpen(false);
  };

  return (
    <TemplatePage
      title="Приемы"
      description="Записи пациентов с готовыми данными пациента, врача и услуги из backend"
      toggleModalState={() => setIsCreateModalOpen(true)}
    >
      {contextHolder}

      <PaginationList entities={dataSource} columns={columns} loading={isLoading} pageSize={8} />

      <EntityModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Создание приема"
        fields={fieldsWithOptions}
        buttonText="Создать"
        onSubmit={handleCreate}
        hasDefaultValue={false}
      />

      <EntityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Редактирование приема"
        fields={fieldsWithOptions}
        defaultValues={selectedAppointment || undefined}
        buttonText="Сохранить изменения"
        onSubmit={handleEdit}
        hasDefaultValue
      />
    </TemplatePage>
  );
};

export default AppointmentsPage;
