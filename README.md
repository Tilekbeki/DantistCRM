# 🦷DantistCRM - CRM для стоматологии
---
<br>
Данный проект состоит из frontend части на REACT 🚀, и backend частин на FASTAPI⚡.


## Сущности в бд:
* allergie
* user
* doctor
* patient
* service
* payment
* medical image
* medical record

## Инструкция

### backend 

`python -m venv название_виртуального_окружения` создаем виртуальное окружение
 


`pip freeze > requirements.txt` записывает список зависимостей

`pip install -r requirements.txt` установка списка зависимостей

`fastapi dev main.py`запускает ее

[схема бд](https://drawsql.app/teams/nurzhigit/diagrams/gippokrat)


схема для создания сущности
```

mutation {
  createUser(name: "Тилекбек Ташбаев", email: "example.com") {
    id
    name
    email
  }
}
```




## Patient

### создание

```
mutation {
  createPatient(patientData: {
    firstName: "Алексей"
    lastName: "Сидоров"
    dateOfBirth: "1990-05-15"
    gender: "male"
    phoneNumber: "+77771234567"
    address: "г. Алматы, ул. Абая 1"
    tgUsername: "alexey_sidorov"
  }) {
    id
    firstName
    lastName
    dateOfBirth
    status
  }
}
```

### полчение одного пацента

```
query {
  patient(patientId: 1) {
    id
    firstName
    lastName
    dateOfBirth
    gender
    phoneNumber
    address
    tgUsername
    status
    createdAt
  }
}
```


### получение всех

```
query {
  patients {
    id
    firstName
    lastName
    dateOfBirth
    gender
    phoneNumber
    status
  }
}
```