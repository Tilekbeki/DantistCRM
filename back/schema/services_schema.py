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