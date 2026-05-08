import {
  Button,
  DatePicker,
  Descriptions,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TemplatePage from './TemplatePage';
import {
  useCreateTreatmentPlanMutation,
  useGetPatientCardQuery,
} from '../store/services/PatientApi';
import { useGetPersonalsQuery } from '../store/services/PersonalApi';
import { useGetServicesQuery } from '../store/services/ServiceApi';

const { Text } = Typography;

const treatmentStatusLabels: Record<string, string> = {
  planned: 'Запланировано',
  in_progress: 'В работе',
  done: 'Завершено',
  cancelled: 'Отменено',
};

type TreatmentFormValues = {
  title: string;
  doctorId: number;
  serviceId?: number;
  appointmentId?: number;
  status: string;
  toothNumbers?: number[];
  plannedAt?: Dayjs;
  diagnosis?: string;
  notes?: string;
};

const formatDate = (value?: string, format = 'DD.MM.YYYY HH:mm') =>
  value ? dayjs(value).format(format) : 'Не указано';

const getFullName = (person?: { name?: string; surname?: string; patronymic?: string }) => {
  const fullName = [person?.surname, person?.name, person?.patronymic].filter(Boolean).join(' ');
  return fullName || 'Не назначен';
};

const PatientCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = Number(id);

  const [form] = Form.useForm<TreatmentFormValues>();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const { data, isFetching } = useGetPatientCardQuery(patientId, {
    skip: Number.isNaN(patientId),
  });
  const { data: personalsData } = useGetPersonalsQuery();
  const { data: servicesData } = useGetServicesQuery();
  const [createTreatmentPlan, { isLoading: isCreatingPlan }] = useCreateTreatmentPlanMutation();

  const card = data?.data?.patientCard;
  const patient = card?.patient;

  const doctorOptions = useMemo(
    () =>
      (personalsData?.data?.allPersonal || []).map((doctor) => ({
        label: getFullName(doctor),
        value: doctor.id,
      })),
    [personalsData],
  );

  const serviceOptions = useMemo(
    () =>
      (servicesData?.data?.allServices || []).map((service) => ({
        label: service.name,
        value: service.id,
      })),
    [servicesData],
  );

  const appointmentOptions = useMemo(
    () =>
      (card?.appointments || []).map((appointment) => ({
        label: `${formatDate(appointment.visitDate)} - ${appointment.service?.name || 'Без услуги'}`,
        value: appointment.id,
      })),
    [card],
  );

  const toothOptions = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => {
        const toothNumber = index + 1;
        return { label: `Зуб ${toothNumber}`, value: toothNumber };
      }),
    [],
  );

  const openPlanModal = () => {
    form.resetFields();
    form.setFieldValue('status', 'planned');
    setIsPlanModalOpen(true);
  };

  const handleCreateTreatment = async (values: TreatmentFormValues) => {
    const result = await createTreatmentPlan({
      patientId,
      doctorId: values.doctorId,
      title: values.title,
      serviceId: values.serviceId,
      appointmentId: values.appointmentId,
      status: values.status,
      toothNumbers: values.toothNumbers,
      plannedAt: values.plannedAt?.toISOString(),
      diagnosis: values.diagnosis,
      notes: values.notes,
    }).unwrap();

    if (result.data.createTreatmentPlan.success) {
      api.success({ message: 'План лечения создан' });
      setIsPlanModalOpen(false);
      return;
    }

    api.error({
      message: 'Не удалось создать план лечения',
      description: result.data.createTreatmentPlan.message,
    });
  };

  if (Number.isNaN(patientId)) {
    return (
      <TemplatePage title="Карточка пациента">
        <Empty description="Некорректный идентификатор пациента" />
      </TemplatePage>
    );
  }

  if (isFetching) {
    return (
      <TemplatePage title="Карточка пациента">
        <Spin />
      </TemplatePage>
    );
  }

  if (!card || !patient) {
    return (
      <TemplatePage title="Карточка пациента">
        <Empty description="Пациент не найден" />
      </TemplatePage>
    );
  }

  const treatmentPlans = card.treatmentPlans || [];
  const appointments = card.appointments || [];
  const media = card.media || [];
  const teeth = card.teeth || [];

  return (
    <TemplatePage
      title={`${patient.surname} ${patient.name}`}
      description="Карточка пациента: планы лечения, статусы, снимки, приемы и история по зубам"
    >
      {contextHolder}

      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 1200 }}>
        <Space wrap>
          <Button onClick={() => navigate('/patients')}>Назад к пациентам</Button>
          <Button type="primary" onClick={openPlanModal}>
            Запланировать лечение
          </Button>
        </Space>

        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="ФИО">
            {patient.surname} {patient.name} {patient.patronymic}
          </Descriptions.Item>
          <Descriptions.Item label="Дата рождения">
            {formatDate(patient.dateOfBirth, 'DD.MM.YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Телефон">{patient.phoneNumber || 'Не указан'}</Descriptions.Item>
          <Descriptions.Item label="Email">{patient.email || 'Не указан'}</Descriptions.Item>
          <Descriptions.Item label="Пол">
            {patient.gender === 'male' ? 'Мужской' : 'Женский'}
          </Descriptions.Item>
          <Descriptions.Item label="Telegram">{patient.tg || 'Не указан'}</Descriptions.Item>
        </Descriptions>

        <Tabs
          items={[
            {
              key: 'treatments',
              label: `Лечения (${treatmentPlans.length})`,
              children: (
                <List
                  bordered
                  dataSource={treatmentPlans}
                  locale={{ emptyText: 'Планы лечения пока не созданы' }}
                  renderItem={(plan) => (
                    <List.Item>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space wrap>
                          <Text strong>{plan.title}</Text>
                          <Tag>{treatmentStatusLabels[plan.status] || plan.status}</Tag>
                          {plan.plannedAt && <Tag>{formatDate(plan.plannedAt)}</Tag>}
                        </Space>
                        <Text>Врач: {getFullName(plan.doctor)}</Text>
                        <Text>Услуга: {plan.service?.name || 'Не выбрана'}</Text>
                        <Text>
                          Зубы: {plan.toothNumbers.length ? plan.toothNumbers.join(', ') : 'Не указаны'}
                        </Text>
                        {plan.diagnosis && <Text>Диагноз: {plan.diagnosis}</Text>}
                        {plan.notes && <Text type="secondary">Заметки: {plan.notes}</Text>}
                        {plan.media.length > 0 && (
                          <Space wrap>
                            {plan.media.map((item) => (
                              <a key={item.id} href={item.fileUrl} target="_blank" rel="noreferrer">
                                {item.type}
                              </a>
                            ))}
                          </Space>
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'appointments',
              label: `Приемы (${appointments.length})`,
              children: (
                <List
                  bordered
                  dataSource={appointments}
                  locale={{ emptyText: 'Приемов пока нет' }}
                  renderItem={(appointment) => (
                    <List.Item>
                      <Space direction="vertical">
                        <Space wrap>
                          <Text strong>{formatDate(appointment.visitDate)}</Text>
                          <Tag>{treatmentStatusLabels[appointment.status] || appointment.status}</Tag>
                        </Space>
                        <Text>Врач: {getFullName(appointment.doctor)}</Text>
                        <Text>Услуга: {appointment.service?.name || 'Не выбрана'}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'media',
              label: `Снимки (${media.length})`,
              children: (
                <List
                  bordered
                  dataSource={media}
                  locale={{ emptyText: 'Снимков и рентгенов пока нет' }}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical">
                        <a href={item.fileUrl} target="_blank" rel="noreferrer">
                          {item.type}
                        </a>
                        <Text type="secondary">{formatDate(item.uploadedAt)}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
            {
              key: 'teeth',
              label: `Зубы (${teeth.length})`,
              children: (
                <List
                  bordered
                  dataSource={teeth}
                  locale={{ emptyText: 'Информация по зубам пока не заполнена' }}
                  renderItem={(tooth) => (
                    <List.Item>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space wrap>
                          <Text strong>Зуб {tooth.toothNumber}</Text>
                          <Tag>{tooth.status}</Tag>
                        </Space>
                        {tooth.history.length === 0 ? (
                          <Text type="secondary">Истории лечения нет</Text>
                        ) : (
                          tooth.history.map((history) => (
                            <Text key={history.id}>
                              {formatDate(history.createdAt)} - {history.service?.name || 'Без услуги'} -{' '}
                              {history.diagnosis || 'Без диагноза'}
                            </Text>
                          ))
                        )}
                      </Space>
                    </List.Item>
                  )}
                />
              ),
            },
          ]}
        />
      </Space>

      <Modal
        open={isPlanModalOpen}
        title="План лечения"
        okText="Создать"
        cancelText="Отмена"
        confirmLoading={isCreatingPlan}
        onCancel={() => setIsPlanModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTreatment}>
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Например: Лечение кариеса 16 зуба" />
          </Form.Item>
          <Form.Item name="doctorId" label="Врач" rules={[{ required: true }]}>
            <Select options={doctorOptions} placeholder="Выберите врача" />
          </Form.Item>
          <Form.Item name="serviceId" label="Услуга">
            <Select allowClear options={serviceOptions} placeholder="Выберите услугу" />
          </Form.Item>
          <Form.Item name="appointmentId" label="Связанный прием">
            <Select allowClear options={appointmentOptions} placeholder="Можно связать с приемом" />
          </Form.Item>
          <Form.Item name="toothNumbers" label="Зубы">
            <Select mode="multiple" options={toothOptions} placeholder="Выберите зубы" />
          </Form.Item>
          <Form.Item name="plannedAt" label="Плановая дата">
            <DatePicker showTime style={{ width: '100%' }} format="DD.MM.YYYY HH:mm" />
          </Form.Item>
          <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
            <Select
              options={[
                { label: 'Запланировано', value: 'planned' },
                { label: 'В работе', value: 'in_progress' },
                { label: 'Завершено', value: 'done' },
                { label: 'Отменено', value: 'cancelled' },
              ]}
            />
          </Form.Item>
          <Form.Item name="diagnosis" label="Диагноз">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="notes" label="Заметки">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </TemplatePage>
  );
};

export default PatientCardPage;
