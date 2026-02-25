from fastapi import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Location(BaseModel):
    latitude: float
    longitude: float

@app.post("/weather")
def get_weather(location: Location):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "current": ["temperature_2m"]
    }
    response = requests.get(url, params=params)
    data = response.json()
    
    temp = data["current"]["temperature_2m"]
    return {
        "temperature": temp,
        "is_warm": temp > 15
    }

