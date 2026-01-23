import dayjs from 'dayjs';

export enum AppointmentStatusEnum {
  planned = 'planned',
  done = 'done',
  cancelled = 'cancelled',
}

export const appointmentFields = [
  {
    name: 'patientId',
    label: 'Пациент',
    type: 'select',
    placeholder: 'Выберите пациента',
    rules: [{ required: true, message: 'Выберите пациента' }],
    options: [], // заполняется на странице
  },
  {
    name: 'doctorId',
    label: 'Врач',
    type: 'select',
    placeholder: 'Выберите врача',
    rules: [{ required: true, message: 'Выберите врача' }],
    options: [],
  },
  {
    name: 'serviceId',
    label: 'Услуга',
    type: 'select',
    placeholder: 'Выберите услугу',
    rules: [{ required: true, message: 'Выберите услугу' }],
    options: [],
  },
  {
    name: 'visitDate',
    label: 'Дата и время приёма',
    type: 'date-time',
    format: 'DD.MM.YYYY HH:mm',
    showTime: true,
    rules: [
      { required: true, message: 'Введите дату приёма' },
      {
        validator: (_: any, value: any) => {
          if (!value) return Promise.resolve();

          const date = dayjs(value);
          if (date.isBefore(dayjs())) {
            return Promise.reject('Дата приёма не может быть в прошлом');
          }

          return Promise.resolve();
        },
      },
    ],
  },
  {
    name: 'status',
    label: 'Статус',
    type: 'select',
    rules: [{ required: true, message: 'Выберите статус' }],
    options: [
      { label: 'Запланирован', value: AppointmentStatusEnum.planned },
      { label: 'Завершён', value: AppointmentStatusEnum.done },
      { label: 'Отменён', value: AppointmentStatusEnum.cancelled },
    ],
  },
];
