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
