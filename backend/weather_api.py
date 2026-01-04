import requests
import os

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_weather(city="Pune"):
    """
    Fetch live weather data from OpenWeather API
    """

    if not API_KEY:
        return {"error": "OpenWeather API key not set"}

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        data = response.json()

        if response.status_code != 200:
            return {"error": data.get("message", "Weather API error")}

        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temperature_c": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "rainfall_mm": data.get("rain", {}).get("1h", 0),
            "condition": data["weather"][0]["description"]
        }

    except Exception as e:
        return {"error": str(e)}
