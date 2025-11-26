import strawberry
from typing import Optional

@strawberry.type
class QueryResult:
    success: bool
    message: str
    data: Optional[int] = None  # Только для ID