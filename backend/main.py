from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI()

class Location(BaseModel):
    latitude: float
    longitude: float

@app.post("/weather")
def get_weather(location: Location):
    # Open-Meteo gratis weer API (geen key nodig)
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

