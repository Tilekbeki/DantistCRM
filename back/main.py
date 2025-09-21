from fastapi import FastAPI
from routers.book import bookroute
import uvicorn

app = FastAPI()

# Сначала определяем все роуты
@app.get("/")
def root():
    return {"message": "Hello World"}

# Затем подключаем другие роутеры
app.include_router(bookroute, prefix="/book")

if __name__ == "__main__":
    uvicorn.run("main:app", host='127.0.0.1', port=8000, reload=True)