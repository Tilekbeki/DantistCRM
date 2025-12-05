import dayjs from "dayjs";

export enum RoleEnum {
  doctor = "doctor",
  nurse = "nurse",
  admin = "admin",
  reception = "reception",
  assistant = "assistant",
  hygienist = "hygienist",
  orthodontist = "orthodontist",
  surgeon = "surgeon",
  therapist = "therapist",
}



// Интерфейс для персоны
export interface IPersonal {
  id?: number;
  avatarUrl?: string;
  name: string;
  surname: string;
  patronymic?: string;
  role: RoleEnum;
  email?: string;
  tg?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  experience: number;
}

// Массив полей для формы
export const personFields = [
  {
    name: "surname",
    label: "Фамилия",
    type: "text",
    placeholder: "Нуржигитов",
    rules: [
      { required: true, message: "Введите фамилию" },
      { min: 2, max: 100, message: "От 2 до 100 символов" },
    ],
  },
  {
    name: "name",
    label: "Имя",
    type: "text",
    placeholder: "Нуржигит",
    rules: [
      { required: true, message: "Введите имя" },
      { min: 2, max: 100, message: "От 2 до 100 символов" },
    ],
  },
  {
    name: "patronymic",
    label: "Отчество",
    type: "text",
    placeholder: "Нуржигитович",
    rules: [
      { max: 100, message: "Максимум 100 символов" },
    ],
  },
  {
      name: "dateOfBirth",
      label: "Дата рождения",
      type: "data-time",
      format:"DD.MM.YYYY",
      showTime:false,
      rules: [
        { required: true, message: "Введите дату рождения" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const date = dayjs(value);
  
            if (date.isAfter(dayjs())) {
              return Promise.reject("Дата не может быть в будущем");
            }
            return Promise.resolve();
          },
        },
      ],
    },
  {
    name: "role",
    label: "Должность",
    type: "select",
    options: [
      { label: "Врач", value: RoleEnum.doctor },
      { label: "Медсестра", value: RoleEnum.nurse },
      { label: "Администратор", value: RoleEnum.admin },
      { label: "Ресепшн", value: RoleEnum.reception },
      { label: "Ассистент", value: RoleEnum.assistant },
      { label: "Гигиенист", value: RoleEnum.hygienist },
      { label: "Ортодонт", value: RoleEnum.orthodontist },
      { label: "Хирург", value: RoleEnum.surgeon },
      { label: "Терапевт", value: RoleEnum.therapist },
    ],
    rules: [
      { required: true, message: "Выберите должность" },
    ],
  },
  {
    name: "email",
    label: "Электронная почта",
    type: "email",
    placeholder: "nurzhitov@gmail.com",
    rules: [
      { type: "email", message: "Введите корректный email" },
      { max: 255, message: "Максимум 255 символов" },
    ],
  },
  {
    name: "tg",
    label: "Телеграм",
    type: "text",
    placeholder: "@nurzhitov",
    rules: [
      { max: 100, message: "Максимум 100 символов" },
      {
        pattern: /^@?[a-zA-Z0-9_]{5,32}$/,
        message: "Введите корректный username Telegram",
      },
    ],
  },
  {
    name: "phoneNumber",
    label: "Телефон",
    type: "tel",
    placeholder: "+998 90 098 78 90",
    rules: [
      {
        pattern: /^\+?[\d\s\-\(\)]{10,20}$/,
        message: "Введите корректный номер телефона",
      },
    ],
  },
  {
    name: "username",
    label: "Логин",
    type: "text",
    placeholder: "nurzhigit",
    rules: [
      { required: true, message: "Введите логин" },
      { min: 3, max: 50, message: "От 3 до 50 символов" },
      {
        pattern: /^[a-zA-Z0-9_]+$/,
        message: "Только латинские буквы, цифры и подчеркивание",
      },
    ],
  },
  {
    name: "password",
    editableByOnlyUser: true,
    label: "Пароль",
    type: "password",
    placeholder: "Введите пароль",
    rules: [
      { required: true, message: "Введите пароль" },
      { min: 6, message: "Минимум 6 символов" },
    ],
  },
  {
    name: "confirmPassword",
    label: "Подтверждение пароля",
    type: "password",
    placeholder: "Повторите пароль",
    dependencies: ["password"],
    editableByOnlyUser: true,
    rules: [
      { required: true, message: "Подтвердите пароль" },
      ({ getFieldValue }: any) => ({
        validator(_: any, value: string) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject("Пароли не совпадают");
        },
      }),
    ],
  },
  {
    name: "experience",
    label: "Опыт работы (лет)",
    type: "number",
    placeholder: "5",
    min: 0,
    max: 50,
    rules: [
      { required: true, message: "Укажите опыт работы" },
    ],
  },
  {
    name: "isActive",
    label: "Активен",
    type: "checkbox",
    valuePropName: "checked",
  },
];

// Константы для фильтров и сортиров