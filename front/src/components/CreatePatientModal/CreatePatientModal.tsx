import dayjs from 'dayjs';
import type { FC } from 'react';

import type { CreateModalPropsInterface } from '../types/types';
import BaseAdminModal from '../../ui/ModalWindow/ModalWindow';



const CreatePatientModal: FC<CreateModalPropsInterface> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {


enum GenderEnum {
  female = 'female',
  male = 'male',
}



const fields = [
  {
    name: 'surname',
    label: 'Фамилия',
    type: 'text',
    placeholder: 'Нуржигитов',
    rules: [
      { required: true, message: 'Пожалуйста, введите фамилию' },
      { min: 2, max: 50, message: 'Пожалуйста, введите от 2 до 50 символов' },
    ],
  },
  {
    name: 'name',
    label: 'Имя',
    type: 'text',
    placeholder: 'Нуржигит',
    rules: [
      { required: true, message: 'Пожалуйста, введите имя' },
      { min: 2, max: 50, message: 'Пожалуйста, введите от 2 до 50 символов' },
    ],
  },
  {
    name: 'patronymic',
    label: 'Отчество',
    type: 'text',
    placeholder: 'Нуржигитович',
    rules: [
      { required: true, message: 'Пожалуйста, введите Отчество' },
      { min: 2, max: 50, message: 'Пожалуйста, введите от 2 до 50 символов' },
    ],
  },
  {
    name: 'gender',
    label: 'Пол',
    type: 'select',
    options: [
      { label: 'Женский', value: GenderEnum.female },
      { label: 'Мужской', value: GenderEnum.male },
    ],
  },
  {
    name: 'birthDate',
    label: 'Дата рождения',
    type: 'data-time',
    format: 'DD.MM.YYYY',
    rules: [
      { required: true, message: 'Пожалуйста, введите дату рождения' },
      {
        validator: (_, value) => {
          if (!value) return Promise.resolve();

          const inputDate = dayjs(+value);
          const currentTime = dayjs();

          if (inputDate.isAfter(currentTime)) {
            return Promise.reject(new Error('Дата рождения не может быть в будущем'));
          }

          if (currentTime.diff(inputDate, 'year') >= 120) {
            return Promise.reject(new Error('Укажите реальную дату рождения'));
          }

          return Promise.resolve();
        },
      },
    ],
  },
    {
    name: 'phone',
    label: 'Телефон',
    type: 'tel',
    placeholder: '+998 90 098 78 90',
    rules: [
      { required: true, message: 'Пожалуйста, введите номер телефона' },
      { pattern: /^\+?[0-9]{10,15}$/, message: 'Введите корректный номер телефона' },
    ],
  },
];

  return (
    <BaseAdminModal
      title="Создание записи на приём"
      fields={fields}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      buttonTitle='hui'
      buttonText = "Создать"
    />
  );
};

export default CreatePatientModal;
