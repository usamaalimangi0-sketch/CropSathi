from fastapi import APIRouter
from app.schemas.irrigation import IrrigationRequest, IrrigationResponse
from app.services.weather_service import weather_service

router = APIRouter(prefix="/irrigation", tags=["Smart Irrigation Advisor"])

@router.post("/advice", response_model=IrrigationResponse)
async def get_smart_irrigation_advice(req: IrrigationRequest):
    """
    Computes intelligent watering guidance combining real Open-Meteo weather
    data (temperature, rainfall, soil moisture) with crop-specific agronomic guidelines.
    """
    lat, lon, loc_name = weather_service.resolve_location(
        req.location, req.latitude, req.longitude
    )

    weather_data = await weather_service.fetch_current_weather(lat, lon)

    response = weather_service.calculate_irrigation_advice(
        crop=req.crop,
        location=loc_name,
        soil_type=req.soil_type or "Loam",
        growth_stage=req.growth_stage or "Vegetative",
        weather=weather_data
    )

    return response
