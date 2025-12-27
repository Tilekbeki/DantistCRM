import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, ConfigProvider, Card, Tag, List, Alert, Space, Typography, Button, Modal } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import ruRU from 'antd/es/locale/ru_RU';
import TemplatePage from './TemplatePage';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, MedicineBoxOutlined, PhoneOutlined } from '@ant-design/icons';

dayjs.locale('ru');

// Интерфейсы на основе вашей структуры данных
interface IAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  serviceId: number;
  visitDate: string;
  createdAt: string;
  status: string;
}

interface IPatient {
  id: number;
  name: string;
  surname: string;
  phone_number?: string;
  [key: string]: any;
}

interface IPersonal {
  id: number;
  name: string;
  surname: string;
  specialization?: string;
  [key: string]: any;
}

interface IService {
  id: number;
  name: string;
  duration?: number;
  price?: number;
  [key: string]: any;
}

// Тип для Redux store
interface RootState {
  appointments: {
    appointmentsList: IAppointment[];
    loading?: boolean;
    error?: string | null;
  };
  patients: {
    patientsList: IPatient[];
  };
  personals: {
    personalsList: IPersonal[];
  };
  services: {
    servicesList: IService[];
  };
}

const SchedulePage: React.FC = () => {
  // Получаем данные из Redux store (аналогично AppintmentList)
  const appointments = useSelector((store: RootState) => store.appointments.appointmentsList);
  const patients = useSelector((store: RootState) => store.patients.patientsList);
  const personals = useSelector((store: RootState) => store.personals.personalsList);
  const services = useSelector((store: RootState) => store.services.servicesList);
  
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Функции для безопасного получения данных по ID
  const getPatientById = (patientId: number): IPatient => {
    const patient = patients[patientId];
    return patient || { id: patientId, name: 'Неизвестно', surname: '', phone_number: '' };
  };

  const getPersonalById = (doctorId: number): IPersonal => {
    const personal = personals[doctorId];
    return personal || { id: doctorId, name: 'Неизвестно', surname: '' };
  };

  const getServiceById = (serviceId: number): IService => {
    const service = services[serviceId];
    return service || { id: serviceId, name: 'Не указана' };
  };

  // Получаем статус для Badge
  const getStatusType = (status: string): BadgeProps['status'] => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'подтверждено':
        return 'success';
      case 'pending':
      case 'ожидание':
        return 'warning';
      case 'cancelled':
      case 'отменено':
        return 'error';
      case 'completed':
      case 'завершено':
        return 'default';
      default:
        return 'processing';
    }
  };

  // Получаем цвет для Tag
  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'подтверждено':
        return 'green';
      case 'pending':
      case 'ожидание':
        return 'orange';
      case 'cancelled':
      case 'отменено':
        return 'red';
      case 'completed':
      case 'завершено':
        return 'blue';
      default:
        return 'default';
    }
  };

  // Получаем русское название статуса
  const getStatusText = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидание';
      case 'cancelled':
        return 'Отменено';
      case 'completed':
        return 'Завершено';
      default:
        return status || 'Неизвестно';
    }
  };

  // Получаем записи для конкретной даты (как в документации)
  const getListData = (value: Dayjs) => {
    const dateString = value.format('YYYY-MM-DD');
    const dateAppointments = appointments.filter(appointment => 
      dayjs(appointment.visitDate).format('YYYY-MM-DD') === dateString
    );

    // Преобразуем записи в формат для отображения в календаре
    return dateAppointments.map(appointment => {
      const patient = getPatientById(appointment.patientId);
      const doctor = getPersonalById(appointment.doctorId);
      
      return {
        type: getStatusType(appointment.status) as string,
        content: `${patient.name} ${patient.surname} - ${dayjs(appointment.visitDate).format('HH:mm')}`,
        appointment: appointment // сохраняем ссылку на оригинальную запись
      };
    });
  };

  // Статистика по месяцам
  const getMonthData = (value: Dayjs) => {
    return appointments.filter(appointment => {
      const appointmentDate = dayjs(appointment.visitDate);
      return appointmentDate.month() === value.month() && 
             appointmentDate.year() === value.year();
    }).length;
  };

  // Обработчик клика по записи
  const handleAppointmentClick = (appointment: IAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalVisible(true);
  };

  // Рендер ячейки календаря (как в документации)
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    
    if (listData.length === 0) {
      return null;
    }

    return (
      <ul className="events p-1">
        {listData.slice(0, 3).map((item, index) => (
          <li 
            key={`${item.content}-${index}`} 
            className="mb-1 cursor-pointer hover:bg-gray-50 rounded px-1"
            onClick={(e) => {
              e.stopPropagation();
              if (item.appointment) {
                handleAppointmentClick(item.appointment);
              }
            }}
          >
            <Badge 
              status={item.type as BadgeProps['status']} 
              text={
                <span className="text-xs truncate">
                  {item.content}
                </span>
              } 
            />
          </li>
        ))}
        {listData.length > 3 && (
          <li className="text-xs text-gray-500 text-center mt-1">
            +{listData.length - 3} ещё
          </li>
        )}
      </ul>
    );
  };

  // Рендер месяца
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section className="font-bold text-blue-600">{num}</section>
        <span className="text-xs text-gray-500">записей</span>
      </div>
    ) : null;
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  // Получаем записи для выбранной даты
  const selectedDateAppointments = useMemo(() => {
    return selectedDate ? appointments.filter(appointment => 
      dayjs(appointment.visitDate).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
    ) : [];
  }, [selectedDate, appointments]);

  // Статистика
  const stats = useMemo(() => ({
    total: appointments.length,
    confirmed: appointments.filter(a => 
      a.status?.toLowerCase() === 'confirmed' || a.status?.toLowerCase() === 'подтверждено'
    ).length,
    pending: appointments.filter(a => 
      a.status?.toLowerCase() === 'pending' || a.status?.toLowerCase() === 'ожидание'
    ).length,
    cancelled: appointments.filter(a => 
      a.status?.toLowerCase() === 'cancelled' || a.status?.toLowerCase() === 'отменено'
    ).length,
    today: appointments.filter(a => 
      dayjs(a.visitDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
    ).length,
    upcoming: appointments.filter(a => 
      dayjs(a.visitDate).isAfter(dayjs()) && 
      (a.status?.toLowerCase() === 'confirmed' || a.status?.toLowerCase() === 'подтверждено')
    ).length,
  }), [appointments]);

  return (
    <TemplatePage title="Расписание" description="Просмотр и управление записями пациентов">
      {/* Статистика */}
      <Card className="mb-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Всего записей</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Подтверждено</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Ожидание</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Отменено</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.today}</div>
            <div className="text-sm text-gray-600">Сегодня</div>
          </div>
          <div className="text-center p-3 bg-cyan-50 rounded-lg">
            <div className="text-2xl font-bold text-cyan-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">Предстоящие</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Календарь */}
        <div className="lg:w-2/3">
          <ConfigProvider locale={ruRU}>
            <Card 
              title="Календарь записей" 
              className="shadow-sm"
              extra={
                <Tag color="blue" icon={<CalendarOutlined />}>
                  {selectedDate ? selectedDate.format('D MMMM YYYY') : 'Выберите дату'}
                </Tag>
              }
            >
              <Calendar 
                cellRender={cellRender}
                onSelect={setSelectedDate}
                style={{ width: '100%' }}
              />
            </Card>
          </ConfigProvider>
        </div>

        {/* Записи на выбранную дату */}
        <div className="lg:w-1/3">
          <Card 
            title={
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ClockCircleOutlined />
                  Записи на день
                </span>
                <Tag color="blue">{selectedDateAppointments.length}</Tag>
              </div>
            }
            className="shadow-sm"
          >
            {selectedDateAppointments.length > 0 ? (
              <List
                dataSource={selectedDateAppointments}
                renderItem={(appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  const doctor = getPersonalById(appointment.doctorId);
                  const service = getServiceById(appointment.serviceId);
                  
                  return (
                    <List.Item 
                      className="!px-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="w-full p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Typography.Text strong className="block">
                              {patient.name} {patient.surname}
                            </Typography.Text>
                            <Typography.Text type="secondary" className="text-xs">
                              Пациент
                            </Typography.Text>
                          </div>
                          <Tag color={getStatusColor(appointment.status)}>
                            {getStatusText(appointment.status)}
                          </Tag>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <UserOutlined className="text-gray-400" />
                            <span>
                              <strong>Врач:</strong> {doctor.name} {doctor.surname}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <ClockCircleOutlined className="text-gray-400" />
                            <span>
                              <strong>Время:</strong> {dayjs(appointment.visitDate).format('HH:mm')}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <MedicineBoxOutlined className="text-gray-400" />
                            <span>
                              <strong>Услуга:</strong> {service.name}
                            </span>
                          </div>
                          
                          {patient.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <PhoneOutlined className="text-gray-400" />
                              <span>
                                <strong>Тел:</strong> {patient.phone_number}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <Typography.Text type="secondary" className="text-xs">
                            Создано: {dayjs(appointment.createdAt).format('DD.MM.YYYY HH:mm')}
                          </Typography.Text>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Alert
                message="Нет записей"
                description="На выбранную дату записей не найдено."
                type="info"
                showIcon
                action={
                  <Button size="small" type="primary">
                    Создать запись
                  </Button>
                }
              />
            )}
          </Card>

          {/* Предстоящие записи */}
          {stats.upcoming > 0 && (
            <Card className="mt-6 shadow-sm" title="Ближайшие записи">
              <List
                dataSource={appointments
                  .filter(a => 
                    (a.status?.toLowerCase() === 'confirmed' || a.status?.toLowerCase() === 'подтверждено') &&
                    dayjs(a.visitDate).isAfter(dayjs())
                  )
                  .sort((a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime())
                  .slice(0, 3)
                }
                renderItem={(appointment) => {
                  const patient = getPatientById(appointment.patientId);
                  const doctor = getPersonalById(appointment.doctorId);
                  
                  return (
                    <List.Item className="!px-0">
                      <div className="w-full p-2 hover:bg-gray-50 rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography.Text strong className="block">
                              {patient.name} {patient.surname}
                            </Typography.Text>
                            <Typography.Text type="secondary" className="text-xs">
                              {doctor.name} {doctor.surname}
                            </Typography.Text>
                          </div>
                          <div className="text-right">
                            <Typography.Text strong className="block">
                              {dayjs(appointment.visitDate).format('HH:mm')}
                            </Typography.Text>
                            <Typography.Text type="secondary" className="text-xs">
                              {dayjs(appointment.visitDate).format('DD.MM')}
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  );
                }}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Модальное окно с деталями записи */}
      <Modal
        title="Детали записи"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Закрыть
          </Button>,
          <Button key="edit" type="primary">
            Редактировать
          </Button>,
          <Button key="cancel" danger>
            Отменить запись
          </Button>,
        ]}
        width={600}
      >
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  Пациент
                </Typography.Text>
                <Typography.Text strong className="block text-lg">
                  {getPatientById(selectedAppointment.patientId).name} {getPatientById(selectedAppointment.patientId).surname}
                </Typography.Text>
              </div>
              
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  Врач
                </Typography.Text>
                <Typography.Text strong className="block text-lg">
                  {getPersonalById(selectedAppointment.doctorId).name} {getPersonalById(selectedAppointment.doctorId).surname}
                </Typography.Text>
              </div>
              
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  Дата и время
                </Typography.Text>
                <Typography.Text strong className="block">
                  {dayjs(selectedAppointment.visitDate).format('DD.MM.YYYY HH:mm')}
                </Typography.Text>
              </div>
              
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  Статус
                </Typography.Text>
                <Tag color={getStatusColor(selectedAppointment.status)} className="text-sm py-1">
                  {getStatusText(selectedAppointment.status)}
                </Tag>
              </div>
              
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  Услуга
                </Typography.Text>
                <Typography.Text strong className="block">
                  {getServiceById(selectedAppointment.serviceId).name}
                </Typography.Text>
              </div>
              
              <div>
                <Typography.Text type="secondary" className="block text-xs mb-1">
                  ID записи
                </Typography.Text>
                <Typography.Text strong className="block">
                  #{selectedAppointment.id}
                </Typography.Text>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Typography.Text type="secondary" className="block text-xs mb-1">
                Контакт пациента
              </Typography.Text>
              <Typography.Text strong className="block text-lg">
                <PhoneOutlined className="mr-2" /> 
                {getPatientById(selectedAppointment.patientId).phone_number || 'Не указан'}
              </Typography.Text>
            </div>
            
            <div>
              <Typography.Text type="secondary" className="block text-xs mb-1">
                Дата создания записи
              </Typography.Text>
              <Typography.Text>
                {dayjs(selectedAppointment.createdAt).format('DD.MM.YYYY HH:mm:ss')}
              </Typography.Text>
            </div>
          </div>
        )}
      </Modal>

      {/* CSS стили для календаря (как в документации) */}
      <style jsx>{`
        .events {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .events .ant-badge-status {
          width: 100%;
          overflow: hidden;
          font-size: 12px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .notes-month {
          text-align: center;
          font-size: 28px;
        }
        .notes-month section {
          font-size: 28px;
        }
      `}</style>
    </TemplatePage>
  );
};

export default SchedulePage;