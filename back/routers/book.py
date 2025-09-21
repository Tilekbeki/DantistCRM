from fastapi import APIRouter

bookroute = APIRouter()

@bookroute.get('/')
def books():
    return {'message': 'Book info'}