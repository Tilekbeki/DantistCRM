import strawberry
from typing import List, Optional
from datetime import date, datetime
from database import SessionLocal
from models.personal import Personal
from .base import QueryResult

# Импортируем функции хэширования из auth_schema
from .auth_schema import get_password_hash, verify_password

@strawberry.input
class PersonalWithPasswordInput:
    avatar_url: Optional[str] = None
    name: str
    surname: str
    patronymic: Optional[str] = None
    role: str
    email: Optional[str] = None
    tg: Optional[str] = None
    phone_number: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = True
    experience: Optional[int] = 0
    date_of_birth: Optional[date] = None

@strawberry.input
class PersonalInput:
    avatar_url: Optional[str] = None
    name: Optional[str] = None
    surname: Optional[str] = None
    patronymic: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    tg: Optional[str] = None
    phone_number: Optional[str] = None
    experience: Optional[int] = None
    is_active: Optional[bool] = None
    date_of_birth: Optional[date] = None

@strawberry.type
class PersonalType:
    id: int
    avatar_url: Optional[str]
    name: str
    surname: str
    patronymic: Optional[str]
    role: str
    email: Optional[str]
    tg: Optional[str]
    phone_number: Optional[str]
    created_at: str
    is_active: bool
    experience: Optional[int] = 0
    date_of_birth: Optional[date] = None
    
    @strawberry.field
    def age(self) -> Optional[int]:
        if not self.date_of_birth:
            return None
        
        today = date.today()
        age = today.year - self.date_of_birth.year
        
        if (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day):
            age -= 1
        
        return age
    
    @strawberry.field
    def formatted_date_of_birth(self) -> Optional[str]:
        if not self.date_of_birth:
            return None
        return self.date_of_birth.strftime("%d.%m.%Y")
    
    @strawberry.field
    def formatted_created_at(self) -> str:
        if isinstance(self.created_at, str):
            dt = datetime.fromisoformat(self.created_at)
        else:
            dt = self.created_at
        return dt.strftime("%d.%m.%Y %H:%M")

@strawberry.type
class PersonalQuery:
    @strawberry.field
    def personal(self, id: int) -> Optional[PersonalType]:
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if personal:
                return PersonalType(
                    id=personal.id,
                    avatar_url=personal.avatar_url,
                    name=personal.name,
                    surname=personal.surname,
                    patronymic=personal.patronymic,
                    role=personal.role,
                    email=personal.email,
                    tg=personal.tg,
                    phone_number=personal.phone_number,
                    created_at=personal.created_at.isoformat(),
                    is_active=personal.is_active,
                    experience=personal.experience,
                    date_of_birth=personal.date_of_birth
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def all_personal(self, role: Optional[str] = None) -> List[PersonalType]:
        db = SessionLocal()
        try:
            query = db.query(Personal)
            if role:
                query = query.filter(Personal.role == role)
            
            personnel = query.all()
            return [
                PersonalType(
                    id=p.id,
                    avatar_url=p.avatar_url,
                    name=p.name,
                    surname=p.surname,
                    patronymic=p.patronymic,
                    role=p.role,
                    email=p.email,
                    tg=p.tg,
                    phone_number=p.phone_number,
                    created_at=p.created_at.isoformat(),
                    is_active=p.is_active,
                    experience=p.experience,
                    date_of_birth=p.date_of_birth
                ) for p in personnel
            ]
        finally:
            db.close()

@strawberry.type
class PersonalMutation:
    @strawberry.mutation
    def create_personal(self, info, input: PersonalWithPasswordInput) -> QueryResult:
        # Пропускаем проверку прав для разработки
        # if hasattr(info.context, 'current_user'):
        #     current_user = info.context.current_user
        #     if not current_user or current_user.role != "admin":
        #         return QueryResult(success=False, message="Требуются права администратора")
        
        db = SessionLocal()
        try:
            # Проверяем уникальность username и email
            if input.username:
                existing = db.query(Personal).filter(Personal.username == input.username).first()
                if existing:
                    return QueryResult(success=False, message="Это имя пользователя уже занято")
            
            if input.email:
                existing = db.query(Personal).filter(Personal.email == input.email).first()
                if existing:
                    return QueryResult(success=False, message="Этот email уже используется")
            
            # Валидация даты рождения
            if input.date_of_birth:
                if input.date_of_birth > date.today():
                    return QueryResult(success=False, message="Дата рождения не может быть в будущем")
                
                age = (date.today() - input.date_of_birth).days / 365.25
                if age > 150:
                    return QueryResult(success=False, message="Некорректная дата рождения")
            
            # Подготавливаем данные для создания
            personal_data = {
                'avatar_url': input.avatar_url,
                'name': input.name,
                'surname': input.surname,
                'patronymic': input.patronymic,
                'role': input.role,
                'email': input.email,
                'tg': input.tg,
                'phone_number': input.phone_number,
                'username': input.username,
                'is_active': input.is_active,
                'experience': input.experience,
                'date_of_birth': input.date_of_birth
            }
            
            # Хэшируем пароль используя функцию из auth_schema
            if input.password:
                # Проверяем длину пароля (как в auth_schema)
                if len(input.password) > 72:
                    return QueryResult(
                        success=False,
                        message="Пароль слишком длинный (максимум 72 символа)"
                    )
                personal_data['hashed_password'] = get_password_hash(input.password)
            
            personal = Personal(**personal_data)
            db.add(personal)
            db.commit()
            db.refresh(personal)
            
            return QueryResult(success=True, message="Персонал создан", data=personal.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_personal(self, info, id: int, input: PersonalInput) -> QueryResult:
        # Пропускаем проверку прав для разработки
        # if hasattr(info.context, 'current_user'):
        #     current_user = info.context.current_user
        #     if not current_user:
        #         return QueryResult(success=False, message="Требуется авторизация")
        #     
        #     if current_user.id != id and current_user.role != "admin":
        #         return QueryResult(success=False, message="Недостаточно прав")
        
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if not personal:
                return QueryResult(success=False, message="Персонал не найден")
            
            # Валидация даты рождения при обновлении
            if input.date_of_birth is not None:
                if input.date_of_birth > date.today():
                    return QueryResult(success=False, message="Дата рождения не может быть в будущем")
                
                age = (date.today() - input.date_of_birth).days / 365.25
                if age > 150:
                    return QueryResult(success=False, message="Некорректная дата рождения")
            
            # Обновляем только переданные поля
            update_data = {}
            if input.avatar_url is not None:
                update_data['avatar_url'] = input.avatar_url
            if input.name is not None:
                update_data['name'] = input.name
            if input.surname is not None:
                update_data['surname'] = input.surname
            if input.patronymic is not None:
                update_data['patronymic'] = input.patronymic
            if input.role is not None:
                update_data['role'] = input.role
            if input.email is not None:
                update_data['email'] = input.email
            if input.tg is not None:
                update_data['tg'] = input.tg
            if input.phone_number is not None:
                update_data['phone_number'] = input.phone_number
            if input.experience is not None:
                update_data['experience'] = input.experience
            if input.is_active is not None:
                update_data['is_active'] = input.is_active
            if input.date_of_birth is not None:
                update_data['date_of_birth'] = input.date_of_birth
            
            for key, value in update_data.items():
                setattr(personal, key, value)
            
            db.commit()
            return QueryResult(success=True, message="Персонал обновлен", data=personal.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()
    
    @strawberry.mutation
    def delete_personal(self, info, id: int) -> QueryResult:
        # Пропускаем проверку прав для разработки
        # if hasattr(info.context, 'current_user'):
        #     current_user = info.context.current_user
        #     if not current_user or current_user.role != "admin":
        #         return QueryResult(success=False, message="Требуются права администратора")
        
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if not personal:
                return QueryResult(success=False, message="Персонал не найден")
            
            db.delete(personal)
            db.commit()
            return QueryResult(success=True, message="Персонал удален")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def change_password(self, info, id: int, current_password: str, new_password: str) -> QueryResult:
        """Смена пароля сотрудника"""
        # Проверка прав (раскомментируйте когда будете готовы)
        # if hasattr(info.context, 'current_user'):
        #     current_user = info.context.current_user
        #     if not current_user:
        #         return QueryResult(success=False, message="Требуется авторизация")
        #     
        #     if current_user.id != id and current_user.role != "admin":
        #         return QueryResult(success=False, message="Недостаточно прав")
        
        db = SessionLocal()
        try:
            personal = db.query(Personal).filter(Personal.id == id).first()
            if not personal:
                return QueryResult(success=False, message="Персонал не найден")
            
            # Проверяем текущий пароль
            if not personal.hashed_password or not verify_password(current_password, personal.hashed_password):
                return QueryResult(success=False, message="Текущий пароль неверен")
            
            # Проверяем длину нового пароля
            if len(new_password) > 72:
                return QueryResult(
                    success=False,
                    message="Новый пароль слишком длинный (максимум 72 символа)"
                )
            
            # Хэшируем и сохраняем новый пароль
            personal.hashed_password = get_password_hash(new_password)
            db.commit()
            
            return QueryResult(success=True, message="Пароль успешно изменен")
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()