import strawberry
from typing import List, Optional
from database import SessionLocal
from models.services import Categories, Service
from .base import QueryResult

@strawberry.input
class CategoryInput:
    name: str

@strawberry.input
class ServiceInput:
    name: str
    description: Optional[str] = None
    duration: int
    price: float
    category_id: int

@strawberry.input
class CategoryUpdateInput:
    id: int
    name: str

@strawberry.input
class ServiceUpdateInput:
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    price: Optional[float] = None
    category_id: Optional[int] = None

@strawberry.type
class CategoryType:
    id: int
    name: str

@strawberry.type
class ServiceType:
    id: int
    name: str
    description: Optional[str]
    duration: int
    price: float
    category_id: int

@strawberry.type
class ServicesQuery:
    @strawberry.field
    def all_categories(self) -> List[CategoryType]:
        db = SessionLocal()
        try:
            categories = db.query(Categories).all()
            return [
                CategoryType(
                    id=c.id,
                    name=c.name
                ) for c in categories
            ]
        finally:
            db.close()

    @strawberry.field
    def all_services(self) -> List[ServiceType]:
        db = SessionLocal()
        try:
            services = db.query(Service).all()
            return [
                ServiceType(
                    id=s.id,
                    name=s.name,
                    description=s.description,
                    duration=s.duration,
                    price=s.price,
                    category_id=s.category_id
                ) for s in services
            ]
        finally:
            db.close()

    @strawberry.field
    def services_by_category(self, category_id: int) -> List[ServiceType]:
        db = SessionLocal()
        try:
            services = db.query(Service).filter(Service.category_id == category_id).all()
            return [
                ServiceType(
                    id=s.id,
                    name=s.name,
                    description=s.description,
                    duration=s.duration,
                    price=s.price,
                    category_id=s.category_id
                ) for s in services
            ]
        finally:
            db.close()

    @strawberry.field
    def category_by_id(self, id: int) -> Optional[CategoryType]:
        db = SessionLocal()
        try:
            category = db.query(Categories).filter(Categories.id == id).first()
            if category:
                return CategoryType(
                    id=category.id,
                    name=category.name
                )
            return None
        finally:
            db.close()

    @strawberry.field
    def service_by_id(self, id: int) -> Optional[ServiceType]:
        db = SessionLocal()
        try:
            service = db.query(Service).filter(Service.id == id).first()
            if service:
                return ServiceType(
                    id=service.id,
                    name=service.name,
                    description=service.description,
                    duration=service.duration,
                    price=service.price,
                    category_id=service.category_id
                )
            return None
        finally:
            db.close()

@strawberry.type
class ServicesMutation:
    @strawberry.mutation
    def create_category(self, input: CategoryInput) -> QueryResult:
        db = SessionLocal()
        try:
            category = Categories(**input.__dict__)
            db.add(category)
            db.commit()
            db.refresh(category)
            return QueryResult(success=True, message="Категория создана", data=category.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def create_service(self, input: ServiceInput) -> QueryResult:
        db = SessionLocal()
        try:
            service = Service(**input.__dict__)
            db.add(service)
            db.commit()
            db.refresh(service)
            return QueryResult(success=True, message="Услуга создана", data=service.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_category(self, input: CategoryUpdateInput) -> QueryResult:
        db = SessionLocal()
        try:
            category = db.query(Categories).filter(Categories.id == input.id).first()
            if not category:
                return QueryResult(success=False, message="Категория не найдена")
            
            category.name = input.name
            db.commit()
            return QueryResult(success=True, message="Категория обновлена", data=category.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def update_service(self, input: ServiceUpdateInput) -> QueryResult:
        db = SessionLocal()
        try:
            service = db.query(Service).filter(Service.id == input.id).first()
            if not service:
                return QueryResult(success=False, message="Услуга не найдена")
            
            # Обновляем только переданные поля
            if input.name is not None:
                service.name = input.name
            if input.description is not None:
                service.description = input.description
            if input.duration is not None:
                service.duration = input.duration
            if input.price is not None:
                service.price = input.price
            if input.category_id is not None:
                service.category_id = input.category_id
            
            db.commit()
            return QueryResult(success=True, message="Услуга обновлена", data=service.id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def delete_category(self, id: int) -> QueryResult:
        db = SessionLocal()
        try:
            # Проверяем, есть ли связанные услуги
            services_count = db.query(Service).filter(Service.category_id == id).count()
            if services_count > 0:
                return QueryResult(
                    success=False, 
                    message=f"Невозможно удалить категорию. Существует {services_count} связанных услуг."
                )
            
            category = db.query(Categories).filter(Categories.id == id).first()
            if not category:
                return QueryResult(success=False, message="Категория не найдена")
            
            db.delete(category)
            db.commit()
            return QueryResult(success=True, message="Категория удалена", data=id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()

    @strawberry.mutation
    def delete_service(self, id: int) -> QueryResult:
        db = SessionLocal()
        try:
            service = db.query(Service).filter(Service.id == id).first()
            if not service:
                return QueryResult(success=False, message="Услуга не найдена")
            
            db.delete(service)
            db.commit()
            return QueryResult(success=True, message="Услуга удалена", data=id)
        except Exception as e:
            db.rollback()
            return QueryResult(success=False, message=str(e))
        finally:
            db.close()