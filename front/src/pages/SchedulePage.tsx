import {
  Button,
  Calendar,
  Card,
  ConfigProvider,
  Empty,
  Modal,
  Segmented,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import type { CalendarProps } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ruRU from 'antd/es/locale/ru_RU';

import { useGetAppointmentsQuery } from '../store/services/AppointmentsApi';
import TemplatePage from './TemplatePage';

dayjs.locale('ru');

const { Text } = Typography;

type ScheduleMode = 'week' | 'month';

type ScheduleAppointment = {
  id: number;
  patientId: number;
  doctorId: number;
  serviceId?: number;
  visitDate: string;
  createdAt: string;
  status: string;
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
  };
  service?: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
};

const statusView: Record<string, { label: string; color: string }> = {
  planned: { label: 'План', color: 'blue' },
  done: { label: 'Готово', color: 'green' },
  cancelled: { label: 'Отмена', color: 'red' },
  canceled: { label: 'Отмена', color: 'red' },
};

const fullName = (person?: { name?: string; surname?: string; patronymic?: string }) =>
  [person?.surname, person?.name, person?.patronymic].filter(Boolean).join(' ') || 'Не указан';

const sameDay = (appointment: ScheduleAppointment, date: Dayjs) =>
  dayjs(appointment.visitDate).format('YYYY-MM-DD') === date.format('YYYY-MM-DD');

const AppointmentCard = ({
  appointment,
  onOpen,
}: {
  appointment: ScheduleAppointment;
  onOpen: (appointment: ScheduleAppointment) => void;
}) => {
  const status = statusView[appointment.status] || { label: appointment.status || '-', color: 'default' };

  return (
    <button
      type="button"
      onClick={() => onOpen(appointment)}
      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left transition hover:border-blue-300 hover:bg-blue-50"
    >
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text strong>{dayjs(appointment.visitDate).format('HH:mm')}</Text>
          <Tag color={status.color} style={{ marginRight: 0 }}>
            {status.label}
          </Tag>
        </Space>
        <Text>{fullName(appointment.patient)}</Text>
        <Text type="secondary">{appointment.service?.name || 'Без услуги'}</Text>
      </Space>
    </button>
  );
};

const SchedulePage = () => {
  const { data, isLoading } = useGetAppointmentsQuery();
  const [mode, setMode] = useState<ScheduleMode>('week');
  const [anchorDate, setAnchorDate] = useState(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleAppointment | null>(null);

  const appointments = (data?.data?.allAppointments || []) as ScheduleAppointment[];

  const weekDays = useMemo(() => {
    const monday = anchorDate.startOf('day').subtract((anchorDate.day() + 6) % 7, 'day');
    return Array.from({ length: 7 }, (_, index) => monday.add(index, 'day'));
  }, [anchorDate]);

  const weekAppointments = useMemo(
    () =>
      weekDays.map((day) => ({
        day,
        appointments: appointments
          .filter((appointment) => sameDay(appointment, day))
          .sort((a, b) => dayjs(a.visitDate).valueOf() - dayjs(b.visitDate).valueOf()),
      })),
    [appointments, weekDays],
  );

  const selectedStatus = selectedAppointment
    ? statusView[selectedAppointment.status] || { label: selectedAppointment.status, color: 'default' }
    : null;

  const dateCellRender = (date: Dayjs) => {
    const dayAppointments = appointments.filter((appointment) => sameDay(appointment, date)).slice(0, 3);

    if (dayAppointments.length === 0) return null;

    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        {dayAppointments.map((appointment) => (
          <button
            key={appointment.id}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedAppointment(appointment);
            }}
            className="w-full truncate rounded bg-blue-50 px-2 py-1 text-left text-xs text-blue-900"
          >
            {dayjs(appointment.visitDate).format('HH:mm')} {fullName(appointment.patient)}
          </button>
        ))}
      </Space>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return (
    <TemplatePage
      title="Расписание"
      description="Недельный и месячный вид приемов с пациентами, врачами и услугами"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
          <Segmented
            value={mode}
            onChange={(value) => setMode(value as ScheduleMode)}
            options={[
              { label: 'Неделя', value: 'week' },
              { label: 'Месяц', value: 'month' },
            ]}
          />

          <Space>
            <Button onClick={() => setAnchorDate(anchorDate.subtract(1, mode))}>Назад</Button>
            <Button onClick={() => setAnchorDate(dayjs())}>Сегодня</Button>
            <Button onClick={() => setAnchorDate(anchorDate.add(1, mode))}>Вперед</Button>
          </Space>
        </Space>

        {isLoading ? (
          <Spin />
        ) : mode === 'week' ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
            {weekAppointments.map(({ day, appointments: dayAppointments }) => {
              const isToday = day.isSame(dayjs(), 'day');

              return (
                <Card
                  key={day.format('YYYY-MM-DD')}
                  size="small"
                  title={
                    <Space direction="vertical" size={0}>
                      <Text strong>{day.format('dd')}</Text>
                      <Text type={isToday ? undefined : 'secondary'}>
                        {day.format('DD.MM')}
                      </Text>
                    </Space>
                  }
                  extra={
                    dayAppointments.length > 0 ? (
                      <Tag color={isToday ? 'blue' : 'default'}>{dayAppointments.length}</Tag>
                    ) : null
                  }
                  className={isToday ? 'border-blue-300' : ''}
                  bodyStyle={{ minHeight: 220, background: '#fafafa' }}
                >
                  {dayAppointments.length > 0 ? (
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                      {dayAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onOpen={setSelectedAppointment}
                        />
                      ))}
                    </Space>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет приемов" />
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <ConfigProvider locale={ruRU}>
            <Card>
              <Calendar
                value={anchorDate}
                onSelect={setAnchorDate}
                cellRender={cellRender}
              />
            </Card>
          </ConfigProvider>
        )}
      </Space>

      <Modal
        open={Boolean(selectedAppointment)}
        title="Прием"
        footer={null}
        onCancel={() => setSelectedAppointment(null)}
      >
        {selectedAppointment ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space style={{ justifyContent: 'space-between', width: '100%' }}>
              <Text strong>{dayjs(selectedAppointment.visitDate).format('DD.MM.YYYY HH:mm')}</Text>
              {selectedStatus ? <Tag color={selectedStatus.color}>{selectedStatus.label}</Tag> : null}
            </Space>

            <div>
              <Text type="secondary">Пациент</Text>
              <div>
                <Link to={`/patients/${selectedAppointment.patientId}`}>
                  {fullName(selectedAppointment.patient)}
                </Link>
              </div>
              <Text type="secondary">{selectedAppointment.patient?.phoneNumber || 'Телефон не указан'}</Text>
            </div>

            <div>
              <Text type="secondary">Врач</Text>
              <div>{fullName(selectedAppointment.doctor)}</div>
            </div>

            <div>
              <Text type="secondary">Услуга</Text>
              <div>{selectedAppointment.service?.name || 'Не выбрана'}</div>
            </div>
          </Space>
        ) : null}
      </Modal>
    </TemplatePage>
  );
};

export default SchedulePage;
