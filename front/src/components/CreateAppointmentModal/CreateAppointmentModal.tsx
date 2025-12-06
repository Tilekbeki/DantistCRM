import dayjs from 'dayjs';
import type { FC } from 'react';

import type { CreateModalPropsInterface } from '../types/types';
import BaseAdminModal from '../../ui/ModalWindow/ModalWindow';

const CreateAppointmentModal: FC<CreateModalPropsInterface> = ({ open, onOpenChange, onSubmit, information }) => {
  const { userId, patientId } = information;

  enum AppointmentStatusEnum {
    PLANNED = 'Запланирован',
    COMPLETED = 'Завершён',
  }

  enum ServiceTypeEnum {
    CHECKUP = 'Плановый осмотр',
    CLEANING = 'Чистка зубов',
    TREATMENT = 'Лечение зуба',
    SURGERY = 'Удаление зуба',
  }

  const PatientsListMock = [
    { id: 1, name: 'Иван Иванов' },
    { id: 2, name: 'Анна Смирнова' },
    { id: 3, name: 'Пётр Петров' },
  ];

  const DoctorsListMock = [
    { id: userId, name: 'д-р Сидоров' },
    { id: 11, name: 'д-р Кузнецова' },
    { id: 12, name: 'д-р Беляев' },
  ];

  const fields = [
    {
      name: 'patientId',
      label: 'Пациент',
      type: 'select',
      rules: [{ required: true, message: 'Пожалуйста, выберите пациента' }],
      options: PatientsListMock.map((p) => ({ label: p.name, value: p.id })),
    },
    {
      name: 'doctorId',
      label: 'Врач',
      type: 'select',
      rules: [{ required: true, message: 'Пожалуйста, выберите врача' }],
      options: DoctorsListMock.map((d) => ({ label: d.name, value: d.id })),
    },
    {
      name: 'appointmentDate',
      label: 'Дата и время приёма',
      type: 'date-time',
      format: 'DD.MM.YYYY HH:mm',
      rules: [
        { required: true, message: 'Пожалуйста, выберите дату и время приёма' },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const selectedDate = dayjs(value);
            if (!selectedDate.isValid()) {
              return Promise.reject(new Error('Некорректная дата'));
            }
            if (selectedDate.isBefore(dayjs())) {
              return Promise.reject(new Error('Дата должна быть в будущем'));
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      name: 'status',
      label: 'Статус приёма',
      type: 'select',
      rules: [{ required: true, message: 'Пожалуйста, выберите статус' }],
      options: Object.values(AppointmentStatusEnum).map((s) => ({
        label: s,
        value: s,
      })),
    },
    {
      name: 'serviceType',
      label: 'Тип услуги',
      type: 'select',
      rules: [{ required: true, message: 'Пожалуйста, выберите тип услуги' }],
      options: Object.values(ServiceTypeEnum).map((t) => ({
        label: t,
        value: t,
      })),
    },
    {
      name: 'notes',
      label: 'Примечание',
      type: 'textarea',
      placeholder: 'Например: «Плановый осмотр и консультация»',
      rules: [{ required: false }],
    },
  ];

  return (
    <BaseAdminModal
      title="Создание записи на приём"
      fields={fields}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      buttonTitle="hui"
    />
  );
};

export default CreateAppointmentModal;
