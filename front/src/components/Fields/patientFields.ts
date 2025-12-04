import dayjs from "dayjs";

export enum GenderEnum {
  female = "female",
  male = "male",
}

export const patientFields = [
  {
    name: "surname",
    label: "Фамилия",
    type: "text",
    placeholder: "Нуржигитов",
    rules: [
      { required: true, message: "Введите фамилию" },
      { min: 2, max: 50, message: "От 2 до 50 символов" },
    ],
  },
  {
    name: "name",
    label: "Имя",
    type: "text",
    placeholder: "Нуржигит",
    rules: [
      { required: true, message: "Введите имя" },
      { min: 2, max: 50, message: "От 2 до 50 символов" },
    ],
  },
  {
    name: "patronymic",
    label: "Отчество",
    type: "text",
    placeholder: "Нуржигитович",
  },
  {
    name: "gender",
    label: "Пол",
    type: "select",
    options: [
      { label: "Женский", value: GenderEnum.female },
      { label: "Мужской", value: GenderEnum.male },
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
    name: "phoneNumber",
    label: "Телефон",
    type: "tel",
    placeholder: "+998 90 098 78 90",
  },
  {
    name: "email",
    label: "Электронная почта",
    type: "email",
    placeholder: "nurzhitov@gmail.com",
  },
  {
    name:"tg",
    label:"Телеграм",
    type:"text",
    placeholder:"@nurzhitov",
  }
];
