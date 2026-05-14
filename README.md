# DantistCRM

CRM для стоматологической клиники. Проект состоит из backend на FastAPI + Strawberry GraphQL и frontend на React + Vite.

## Структура проекта

```text
DantistCRM/
+-- back/    # FastAPI, GraphQL, SQLAlchemy, SQLite
+-- front/   # React, Vite, Redux Toolkit Query, Ant Design
```

## Развертывание

### Backend

Перейдите в папку backend:

```bash
cd back
```

Создайте и активируйте виртуальное окружение:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Установите зависимости:

```bash
pip install -r requirements.txt
```

Запустите сервер:

```bash
fastapi dev main.py
```

Backend будет доступен по адресу:

```text
http://localhost:8000
```

GraphQL endpoint:

```text
http://localhost:8000/graphql
```

При старте приложение создает таблицы SQLite автоматически в файле `back/test.db`. Также создается администратор:

```text
username: admin
password: admin123
```

Опционально можно заполнить базу тестовыми данными:

```bash
python seed.py
```

### Frontend

Перейдите в папку frontend:

```bash
cd front
```

Установите зависимости:

```bash
npm install
```

Запустите frontend:

```bash
npm run dev
```

Обычно Vite запускается на:

```text
http://localhost:5173
```

### Полезные команды frontend

```bash
npm run build
npm run preview
npm run lint
npm run lint:fix
```

## Сущности

### Personal

Сотрудники клиники: администраторы, врачи, ассистенты, менеджеры.

Основные поля:

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID сотрудника |
| `avatarUrl` | `String` | ссылка на аватар |
| `name` | `String` | имя |
| `surname` | `String` | фамилия |
| `patronymic` | `String` | отчество |
| `role` | `String` | роль: например `admin`, `doctor`, `assistant`, `manager`, `reception` |
| `email` | `String` | email |
| `tg` | `String` | Telegram |
| `phoneNumber` | `String` | телефон |
| `username` | `String` | логин |
| `isActive` | `Boolean` | активен ли сотрудник |
| `experience` | `Int` | стаж |
| `dateOfBirth` | `Date` | дата рождения |
| `createdAt` | `String` | дата создания |

### Patient

Пациенты клиники.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID пациента |
| `avatarLink` | `String` | ссылка на аватар |
| `name` | `String` | имя |
| `surname` | `String` | фамилия |
| `patronymic` | `String` | отчество |
| `dateOfBirth` | `String` | дата рождения в формате `YYYY-MM-DD` |
| `email` | `String` | email |
| `phoneNumber` | `String` | телефон |
| `tg` | `String` | Telegram |
| `gender` | `Gender` | `MALE` или `FEMALE` |
| `createdAt` | `String` | дата создания |

### Appointment

Записи пациента на прием.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID записи |
| `patientId` | `Int` | ID пациента |
| `doctorId` | `Int` | ID врача из `Personal` |
| `serviceId` | `Int` | ID услуги |
| `visitDate` | `String` | дата и время приема в ISO-формате |
| `status` | `String` | например `planned`, `done`, `cancelled` |
| `createdAt` | `String` | дата создания |

### Category

Категория услуг.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID категории |
| `name` | `String` | название |

### Service

Услуги клиники.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID услуги |
| `name` | `String` | название |
| `description` | `String` | описание |
| `duration` | `Int` | длительность в минутах |
| `price` | `Float` | цена |
| `categoryId` | `Int` | ID категории |

### Allergies и PatientAllergies

Справочник аллергий и связь пациента с аллергией.

| Сущность | Основные поля |
| --- | --- |
| `Allergies` | `id`, `name`, `description` |
| `PatientAllergies` | `id`, `patientId`, `allergyId`, `createdAt` |

### Teeth и TeethHistory

Зубная карта пациента и история лечения зубов.

| Сущность | Основные поля |
| --- | --- |
| `Teeth` | `id`, `patientId`, `toothNumber`, `status` |
| `TeethHistory` | `id`, `toothId`, `serviceId`, `doctorId`, `diagnosis`, `notes`, `createdAt` |

### PatientMedia

Медиафайлы пациента или приема.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID медиа |
| `patientId` | `Int` | ID пациента |
| `appointmentId` | `Int` | ID приема, опционально |
| `type` | `String` | тип файла |
| `fileUrl` | `String` | ссылка на файл |
| `uploadedAt` | `String` | дата загрузки |

### TreatmentPlan

Планы лечения пациента.

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | `Int` | ID плана |
| `patientId` | `Int` | ID пациента |
| `doctorId` | `Int` | ID врача |
| `serviceId` | `Int` | ID услуги, опционально |
| `appointmentId` | `Int` | ID приема, опционально |
| `title` | `String` | название плана |
| `diagnosis` | `String` | диагноз |
| `notes` | `String` | заметки |
| `status` | `String` | статус, по умолчанию `planned` |
| `toothNumbers` | `[Int]` | номера зубов |
| `plannedAt` | `String` | запланированная дата в ISO-формате |
| `createdAt` | `String` | дата создания |

### PatientRecords

Медицинские записи пациента.

Поля: `id`, `patientId`, `doctorId`, `serviceId`, `diagnose`, `notes`, `createdAt`.

Важно: модель и схема `medical_records_schema.py` есть в проекте, но на текущий момент `MedicalRecordsQuery` и `MedicalRecordsMutation` не подключены в `back/main.py`, поэтому напрямую через `/graphql` эти операции недоступны.

## API

Все запросы отправляются методом `POST` на один endpoint:

```text
http://localhost:8000/graphql
```

Заголовки:

```http
Content-Type: application/json
Authorization: Bearer <accessToken>
```

`Authorization` нужен для запросов, где требуется текущий пользователь. Большая часть проверок прав сейчас закомментирована, но токен можно получить через `login`.

Формат тела запроса:

```json
{
  "query": "query или mutation",
  "variables": {}
}
```

## GraphQL запросы и данные

### Авторизация

#### Login

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `username` | `String` | да |
| `password` | `String` | да |

```graphql
mutation Login($username: String!, $password: String!) {
  login(input: { username: $username, password: $password }) {
    accessToken
    tokenType
    expiresIn
    userId
    username
    role
    name
    surname
  }
}
```

Пример variables:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### Register

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `username` | `String` | да |
| `email` | `String` | да |
| `password` | `String` | да |
| `name` | `String` | да |
| `surname` | `String` | да |
| `patronymic` | `String` | нет |
| `role` | `String` | нет, по умолчанию `reception` |

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "username": "doctor1",
    "email": "doctor1@example.com",
    "password": "123456",
    "name": "Айбек",
    "surname": "Иванов",
    "patronymic": "Петрович",
    "role": "doctor"
  }
}
```

### Personal

#### Получить всех сотрудников

```graphql
query {
  allPersonal {
    id
    avatarUrl
    name
    surname
    patronymic
    role
    email
    username
    tg
    phoneNumber
    isActive
    experience
    dateOfBirth
    createdAt
  }
}
```

Можно фильтровать по роли:

```graphql
query {
  allPersonal(role: "doctor") {
    id
    name
    surname
    role
  }
}
```

#### Получить сотрудника

```graphql
query GetPersonal($id: Int!) {
  personal(id: $id) {
    id
    name
    surname
    role
    email
    username
  }
}
```

```json
{ "id": 1 }
```

#### Создать сотрудника

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `name` | `String` | да |
| `surname` | `String` | да |
| `role` | `String` | да |
| `patronymic` | `String` | нет |
| `email` | `String` | нет |
| `username` | `String` | нет |
| `password` | `String` | нет |
| `avatarUrl` | `String` | нет |
| `tg` | `String` | нет |
| `phoneNumber` | `String` | нет |
| `isActive` | `Boolean` | нет |
| `experience` | `Int` | нет |
| `dateOfBirth` | `Date` | нет |

```graphql
mutation CreatePersonal($input: PersonalWithPasswordInput!) {
  createPersonal(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "name": "Айбек",
    "surname": "Иванов",
    "patronymic": "Петрович",
    "role": "doctor",
    "email": "doctor@example.com",
    "username": "doctor",
    "password": "123456",
    "phoneNumber": "+996700000000",
    "experience": 5,
    "isActive": true,
    "dateOfBirth": "1990-01-15"
  }
}
```

#### Обновить сотрудника

```graphql
mutation UpdatePersonal($id: Int!, $input: PersonalInput!) {
  updatePersonal(id: $id, input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "id": 1,
  "input": {
    "phoneNumber": "+996777111222",
    "experience": 6
  }
}
```

#### Удалить сотрудника

```graphql
mutation DeletePersonal($id: Int!) {
  deletePersonal(id: $id) {
    success
    message
    data
  }
}
```

### Patients

#### Получить всех пациентов

```graphql
query {
  allPatients {
    id
    name
    surname
    patronymic
    email
    avatarLink
    dateOfBirth
    gender
    phoneNumber
    tg
    createdAt
  }
}
```

#### Получить пациента

```graphql
query GetPatient($id: Int!) {
  patient(id: $id) {
    id
    name
    surname
    patronymic
    email
    dateOfBirth
    gender
    phoneNumber
    tg
    createdAt
  }
}
```

#### Получить карточку пациента

Карточка возвращает пациента, записи на прием, медицинские записи, медиа, зубы и планы лечения.

```graphql
query GetPatientCard($id: Int!) {
  patientCard(id: $id) {
    patient {
      id
      name
      surname
      patronymic
      phoneNumber
    }
    appointments {
      id
      visitDate
      status
      doctor { id name surname role }
      service { id name duration price }
    }
    media { id type fileUrl uploadedAt }
    teeth { id toothNumber status }
    treatmentPlans { id title status toothNumbers plannedAt }
  }
}
```

#### Создать пациента

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `name` | `String` | да |
| `surname` | `String` | да |
| `patronymic` | `String` | да |
| `avatarLink` | `String` | нет |
| `dateOfBirth` | `String` | нет, формат `YYYY-MM-DD` |
| `email` | `String` | нет |
| `phoneNumber` | `String` | нет |
| `tg` | `String` | нет |
| `gender` | `Gender` | нет, `MALE` или `FEMALE` |

```graphql
mutation CreatePatient($input: PatientInput!) {
  createPatient(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "name": "Алексей",
    "surname": "Сидоров",
    "patronymic": "Иванович",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "phoneNumber": "+77771234567",
    "email": "alexey@example.com",
    "tg": "@alexey"
  }
}
```

#### Обновить пациента

```graphql
mutation UpdatePatient($id: Int!, $input: PatientInput!) {
  updatePatient(id: $id, input: $input) {
    success
    message
    data
  }
}
```

#### Удалить пациента

```graphql
mutation DeletePatient($id: Int!) {
  deletePatient(id: $id) {
    success
    message
    data
  }
}
```

### Appointments

#### Получить записи

```graphql
query {
  allAppointments {
    id
    patientId
    doctorId
    serviceId
    createdAt
    visitDate
    status
    patient { id name surname patronymic phoneNumber }
    doctor { id name surname patronymic role }
    service { id name duration price }
  }
}
```

Можно фильтровать:

```graphql
query {
  allAppointments(patientId: 1, doctorId: 2) {
    id
    visitDate
    status
  }
}
```

#### Получить одну запись

```graphql
query GetAppointment($id: Int!) {
  appointment(id: $id) {
    id
    patientId
    doctorId
    serviceId
    visitDate
    status
  }
}
```

#### Создать запись

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `patientId` | `Int` | да |
| `doctorId` | `Int` | да |
| `serviceId` | `Int` | нет |
| `visitDate` | `String` | да, ISO-формат |
| `status` | `String` | нет, по умолчанию `planned` |

```graphql
mutation CreateAppointment($input: AppointmentInput!) {
  createAppointment(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "patientId": 1,
    "doctorId": 2,
    "serviceId": 3,
    "visitDate": "2026-05-20T10:30:00",
    "status": "planned"
  }
}
```

### Categories и Services

#### Получить категории и услуги

```graphql
query {
  allCategories {
    id
    name
  }
  allServices {
    id
    name
    description
    duration
    price
    categoryId
  }
}
```

#### Получить услуги по категории

```graphql
query ServicesByCategory($categoryId: Int!) {
  servicesByCategory(categoryId: $categoryId) {
    id
    name
    duration
    price
  }
}
```

#### Создать категорию

```graphql
mutation CreateCategory($input: CategoryInput!) {
  createCategory(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "name": "Терапия"
  }
}
```

#### Создать услугу

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `name` | `String` | да |
| `description` | `String` | нет |
| `duration` | `Int` | да |
| `price` | `Float` | да |
| `categoryId` | `Int` | да |

```graphql
mutation CreateService($input: ServiceInput!) {
  createService(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "name": "Лечение кариеса",
    "description": "Пломбирование зуба",
    "duration": 60,
    "price": 3500,
    "categoryId": 1
  }
}
```

#### Обновить категорию

```graphql
mutation UpdateCategory($input: CategoryUpdateInput!) {
  updateCategory(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "id": 1,
    "name": "Ортодонтия"
  }
}
```

#### Обновить услугу

```graphql
mutation UpdateService($input: ServiceUpdateInput!) {
  updateService(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "id": 1,
    "price": 4000,
    "duration": 75
  }
}
```

#### Удалить категорию или услугу

```graphql
mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id) {
    success
    message
    data
  }
}
```

```graphql
mutation DeleteService($id: Int!) {
  deleteService(id: $id) {
    success
    message
    data
  }
}
```

### Allergies

#### Получить аллергии

```graphql
query {
  allAllergies {
    id
    name
    description
  }
}
```

#### Получить аллергии пациента

```graphql
query PatientAllergies($patientId: Int!) {
  patientAllergies(patientId: $patientId) {
    id
    patientId
    allergyId
    createdAt
  }
}
```

#### Создать аллергию

```graphql
mutation CreateAllergy($input: AllergyInput!) {
  createAllergy(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "name": "Лидокаин",
    "description": "Аллергия на анестетик"
  }
}
```

#### Добавить аллергию пациенту

```graphql
mutation AddPatientAllergy($input: PatientAllergiesInput!) {
  addPatientAllergy(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "patientId": 1,
    "allergyId": 1
  }
}
```

### Teeth

#### Получить зубы пациента

```graphql
query TeethForPatient($patientId: Int!) {
  teethForPatient(patientId: $patientId) {
    id
    patientId
    toothNumber
    status
  }
}
```

#### Получить историю зуба

```graphql
query ToothHistory($toothId: Int!) {
  toothHistory(toothId: $toothId) {
    id
    toothId
    serviceId
    doctorId
    diagnosis
    notes
    createdAt
  }
}
```

#### Создать или обновить запись зуба

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `patientId` | `Int` | да |
| `toothNumber` | `Int` | да |
| `status` | `String` | нет, по умолчанию `healthy` |

```graphql
mutation CreateTeethRecord($input: TeethInput!) {
  createTeethRecord(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "patientId": 1,
    "toothNumber": 16,
    "status": "treated"
  }
}
```

#### Добавить историю зуба

```graphql
mutation AddTeethHistory($input: TeethHistoryInput!) {
  addTeethHistory(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "toothId": 1,
    "serviceId": 2,
    "doctorId": 1,
    "diagnosis": "Кариес",
    "notes": "Проведено лечение"
  }
}
```

### Media

#### Получить медиа пациента

```graphql
query PatientMedia($patientId: Int!) {
  patientMedia(patientId: $patientId) {
    id
    patientId
    appointmentId
    type
    fileUrl
    uploadedAt
  }
}
```

#### Получить медиа приема

```graphql
query AppointmentMedia($appointmentId: Int!) {
  appointmentMedia(appointmentId: $appointmentId) {
    id
    patientId
    appointmentId
    type
    fileUrl
    uploadedAt
  }
}
```

#### Добавить медиа

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `patientId` | `Int` | да |
| `appointmentId` | `Int` | нет |
| `type` | `String` | да |
| `fileUrl` | `String` | да |

```graphql
mutation CreatePatientMedia($input: PatientMediaInput!) {
  createPatientMedia(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "patientId": 1,
    "appointmentId": 2,
    "type": "xray",
    "fileUrl": "https://example.com/xray-1.png"
  }
}
```

#### Удалить медиа

```graphql
mutation DeletePatientMedia($id: Int!) {
  deletePatientMedia(id: $id) {
    success
    message
  }
}
```

### Treatment Plans

#### Получить планы лечения

```graphql
query TreatmentPlans($patientId: Int) {
  treatmentPlans(patientId: $patientId) {
    id
    patientId
    doctorId
    serviceId
    appointmentId
    title
    diagnosis
    notes
    status
    toothNumbers
    plannedAt
    createdAt
  }
}
```

#### Создать план лечения

Передать:

| Поле | Тип | Обязательно |
| --- | --- | --- |
| `patientId` | `Int` | да |
| `doctorId` | `Int` | да |
| `title` | `String` | да |
| `serviceId` | `Int` | нет |
| `appointmentId` | `Int` | нет |
| `diagnosis` | `String` | нет |
| `notes` | `String` | нет |
| `status` | `String` | нет, по умолчанию `planned` |
| `toothNumbers` | `[Int]` | нет |
| `plannedAt` | `String` | нет, ISO-формат |

```graphql
mutation CreateTreatmentPlan($input: TreatmentPlanInput!) {
  createTreatmentPlan(input: $input) {
    success
    message
    data
  }
}
```

```json
{
  "input": {
    "patientId": 1,
    "doctorId": 2,
    "serviceId": 3,
    "appointmentId": 4,
    "title": "План лечения кариеса",
    "diagnosis": "Кариес 16 зуба",
    "notes": "Пломбирование",
    "status": "planned",
    "toothNumbers": [16, 17],
    "plannedAt": "2026-05-20T10:30:00"
  }
}
```

## Frontend маршруты

| Путь | Страница |
| --- | --- |
| `/login` | авторизация |
| `/` | главная |
| `/patients` | пациенты |
| `/patients/:id` | карточка пациента |
| `/appointments` | записи на прием |
| `/medicalcards` | медицинские карты |
| `/medicalcards/:id` | карточка пациента из медицинских карт |
| `/schedule` | расписание |
| `/personal` | персонал |
| `/services` | услуги |

## Пример запроса через curl

```bash
curl -X POST http://localhost:8000/graphql ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"query { allPatients { id name surname phoneNumber } }\"}"
```

## Примечания

- GraphQL использует camelCase в API: например, Python-поле `phone_number` доступно как `phoneNumber`.
- Даты передаются строками в ISO-формате: `YYYY-MM-DD` для дат рождения и `YYYY-MM-DDTHH:MM:SS` для дат приема.
- Основной ответ мутаций имеет формат `success`, `message`, `data`, где `data` обычно содержит ID созданной или измененной записи.
- База данных SQLite хранится в `back/test.db`.
