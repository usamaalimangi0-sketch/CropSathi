import httpx
from typing import Optional, Dict, Any, Tuple
from app.core.logging import logger
from app.schemas.irrigation import IrrigationResponse

# Coordinates for major Pakistani agricultural hubs
PAKISTAN_AGRI_HUBS = {
    "hyderabad": {"name": "Hyderabad, Sindh", "lat": 25.3960, "lon": 68.3578},
    "sukkur": {"name": "Sukkur, Sindh", "lat": 27.7052, "lon": 68.8574},
    "larkana": {"name": "Larkana, Sindh", "lat": 27.5589, "lon": 68.2120},
    "mirpurkhas": {"name": "Mirpur Khas, Sindh", "lat": 25.5269, "lon": 69.0111},
    "nawabshah": {"name": "Nawabshah, Sindh", "lat": 26.2483, "lon": 68.4096},
    "multan": {"name": "Multan, Punjab", "lat": 30.1575, "lon": 71.5249},
    "bahawalpur": {"name": "Bahawalpur, Punjab", "lat": 29.3544, "lon": 71.6911},
    "faisalabad": {"name": "Faisalabad, Punjab", "lat": 31.4504, "lon": 73.1350},
    "sahiwal": {"name": "Sahiwal, Punjab", "lat": 30.6682, "lon": 73.1114},
    "peshawar": {"name": "Peshawar, KPK", "lat": 34.0151, "lon": 71.5249},
    "quetta": {"name": "Quetta, Balochistan", "lat": 30.1798, "lon": 66.9750},
}

class WeatherService:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    def resolve_location(self, location_name: str, lat: Optional[float], lon: Optional[float]) -> Tuple[float, float, str]:
        if lat is not None and lon is not None:
            return lat, lon, location_name

        key = location_name.lower().split(",")[0].strip()
        if key in PAKISTAN_AGRI_HUBS:
            info = PAKISTAN_AGRI_HUBS[key]
            return info["lat"], info["lon"], info["name"]
        
        # Default fallback to Hyderabad, Sindh (DITE Hackathon location)
        return 25.3960, 68.3578, location_name or "Hyderabad, Sindh"

    async def fetch_current_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        try:
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m",
                "hourly": "soil_moisture_0_to_1cm",
                "timezone": "auto"
            }
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(self.BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    # Calculate average soil moisture if available
                    soil_moisture = None
                    hourly_sm = data.get("hourly", {}).get("soil_moisture_0_to_1cm", [])
                    if hourly_sm:
                        soil_moisture = round(hourly_sm[0] * 100, 1)  # as percentage

                    return {
                        "temperature_c": current.get("temperature_2m"),
                        "relative_humidity_pct": current.get("relative_humidity_2m"),
                        "precipitation_mm": current.get("precipitation", 0.0),
                        "wind_speed_kmh": current.get("wind_speed_10m"),
                        "soil_moisture_pct": soil_moisture,
                        "time": current.get("time")
                    }
        except Exception as e:
            logger.warning(f"Failed to fetch live weather from Open-Meteo: {e}")
            return None

    def calculate_irrigation_advice(
        self,
        crop: str,
        location: str,
        soil_type: str,
        growth_stage: str,
        weather: Optional[Dict[str, Any]]
    ) -> IrrigationResponse:
        crop_lower = crop.lower()
        temp = weather.get("temperature_c", 30.0) if weather else 30.0
        precip = weather.get("precipitation_mm", 0.0) if weather else 0.0
        humidity = weather.get("relative_humidity_pct", 40.0) if weather else 40.0

        urgency = "normal"
        guidelines = []

        # Weather-grounded reasoning
        if precip > 5.0:
            watering_advice = f"Recent or current rainfall recorded ({precip} mm). Hold scheduled irrigation to prevent waterlogging and root asphyxiation."
            urgency = "hold"
            guidelines.append("Do not apply flood irrigation immediately after rain.")
            guidelines.append("Ensure field drainage channels are clear, particularly in clay soils.")
        elif temp > 36.0 and humidity < 30.0:
            watering_advice = f"High heat stress ({temp}°C) and low atmospheric humidity ({humidity}%). Evapotranspiration is severe. Water during early morning or late evening."
            urgency = "high"
            guidelines.append("Apply water during cooler evening hours to minimize evaporative loss.")
            guidelines.append("Inspect field edges for rapid wilting.")
        elif temp < 18.0:
            watering_advice = f"Cool temperatures ({temp}°C) indicate low crop evapotranspiration. Water requirement is reduced."
            urgency = "low"
            guidelines.append("Stretch irrigation intervals by 2 to 4 days compared to peak summer schedule.")
        else:
            watering_advice = f"Moderate conditions ({temp}°C, {humidity}% RH). Maintain standard recommended irrigation intervals for {crop}."
            urgency = "normal"

        # Crop-specific guidelines
        if "cotton" in crop_lower:
            guidelines.append("Avoid standing water around cotton roots; cotton is highly sensitive to wilt and root rot in stagnant water.")
            guidelines.append("During flowering and boll formation, avoid moisture stress to prevent square shedding.")
        elif "wheat" in crop_lower:
            guidelines.append("Critical irrigation stages for wheat: Crown Root Initiation (20-25 days after sowing), Tillering, Flowering, and Milking.")
            guidelines.append("Avoid heavy irrigation during high wind days to prevent lodging (crop falling over).")
        elif "rice" in crop_lower:
            guidelines.append("Maintain 2 to 3 inches of standing water during vegetative and panicle initiation phases.")
            guidelines.append("Drain water 10 to 14 days before harvest to facilitate uniform grain drying.")
        elif "tomato" in crop_lower or "chilli" in crop_lower:
            guidelines.append("Provide uniform, consistent moisture; alternating severe dry and wet spells causes Blossom End Rot and fruit cracking.")
            guidelines.append("Drip irrigation or furrow irrigation is strongly preferred over overhead spraying to prevent fungal leaf blights.")

        soil_moisture_estimate = f"{weather.get('soil_moisture_pct')}% (Topsoil 0-1cm)" if weather and weather.get("soil_moisture_pct") else "Estimated based on regional weather"

        return IrrigationResponse(
            crop=crop,
            location=location,
            soil_type=soil_type,
            growth_stage=growth_stage,
            watering_advice=watering_advice,
            urgency=urgency,
            soil_moisture_estimate=soil_moisture_estimate,
            weather_summary=weather,
            guidelines=guidelines,
            data_source="Open-Meteo Free Agro-meteorology API (Live Observations)" if weather else "Agronomic Estimation (Weather service offline)"
        )

weather_service = WeatherService()
