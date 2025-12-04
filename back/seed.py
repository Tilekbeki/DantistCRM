import sqlite3
from faker import Faker
import random

fake = Faker("ru_RU")

DB_PATH = "test.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# ----------------------------------------------------
#   PERSONAL
# ----------------------------------------------------
def seed_personal(n=10):
    roles = ["admin", "doctor", "assistant", "manager"]

    for _ in range(n):
        name = fake.first_name()
        surname = fake.last_name()
        patronymic = fake.middle_name()

        email = fake.email()
        tg = f"@{fake.user_name()}"
        phone = fake.phone_number()
        username = fake.user_name()
        hashed_password = fake.sha256()
        is_active = random.choice([0, 1])
        last_login = fake.date_time_between(start_date='-10d', end_date='now')
        experience = random.randint(1, 30)
        dob = fake.date_between(start_date='-60y', end_date='-22y')
        role = random.choice(roles)

        cursor.execute("""
            INSERT INTO personal (
                avatar_url, name, surname, patronymic, role,
                email, tg, phone_number, username, hashed_password,
                is_active, last_login, experience, date_of_birth
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            None, name, surname, patronymic, role,
            email, tg, phone, username, hashed_password,
            is_active, last_login, experience, dob
        ))

    conn.commit()
    print(f"[OK] Добавлено {n} сотрудников (personal)")
# ----------------------------------------------------
#   PATIENTS
# ----------------------------------------------------
def seed_patients(n=30):
    for _ in range(n):
        name = fake.first_name()
        surname = fake.last_name()
        patronymic = fake.middle_name()

        dob = fake.date_between(start_date='-60y', end_date='-10y')
        email = fake.email()
        phone = fake.phone_number()
        tg = f"@{fake.user_name()}"
        gender = random.choice(["MALE", "FEMALE"])

        cursor.execute("""
            INSERT INTO patients (avatar_link, name, surname, patronymic, date_of_birth,
                                  email, phone_number, tg, gender)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (None, name, surname, patronymic, dob, email, phone, tg, gender))

    conn.commit()
    print(f"[OK] Добавлено {n} пациентов")


# ----------------------------------------------------
#   SERVICES
# ----------------------------------------------------
def seed_services():
    services = [
        ("Чистка зубов", "Профессиональная гигиена", 40, 2500, 1),
        ("Пломбирование", "Лечение кариеса", 60, 3500, 1),
        ("Удаление зуба", "Хирургическое удаление", 30, 4500, 2),
        ("Консультация", "Осмотр и рекомендации", 20, 1000, 3),
    ]

    for s in services:
        cursor.execute("""
            INSERT INTO services (name, description, duration, price, category_id)
            VALUES (?, ?, ?, ?, ?)
        """, s)

    conn.commit()
    print("[OK] Добавлены услуги")


# ----------------------------------------------------
#   APPOINTMENTS
# ----------------------------------------------------
def seed_appointments(n=40):
    cursor.execute("SELECT id FROM patients")
    patient_ids = [r[0] for r in cursor.fetchall()]

    cursor.execute("SELECT id FROM services")
    service_ids = [r[0] for r in cursor.fetchall()]

    cursor.execute("SELECT id FROM personal")
    doctor_ids = [r[0] for r in cursor.fetchall()] or [1]  # fallback если нет данных

    for _ in range(n):
        patient_id = random.choice(patient_ids)
        doctor_id = random.choice(doctor_ids)
        service_id = random.choice(service_ids)

        visit_date = fake.date_time_between(start_date='-30d', end_date='+30d')
        status = random.choice(["planned", "done", "canceled"])

        cursor.execute("""
            INSERT INTO appointments (patient_id, doctor_id, service_id, visit_date, status)
            VALUES (?, ?, ?, ?, ?)
        """, (patient_id, doctor_id, service_id, visit_date, status))

    conn.commit()
    print(f"[OK] Добавлено {n} записей")


# ----------------------------------------------------
#   RUN SEEDING
# ----------------------------------------------------
if __name__ == "__main__":
    seed_personal(8)
    seed_patients(20)
    seed_services()
    seed_appointments(40)

    conn.close()
    print("Готово!")
