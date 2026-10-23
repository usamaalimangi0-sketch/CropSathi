from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class IrrigationRequest(BaseModel):
    crop: str = Field(..., description="Crop name (e.g. Wheat, Cotton, Rice, Sugarcane)")
    location: str = Field(default="Hyderabad, Sindh", description="District or city in Pakistan")
    soil_type: Optional[str] = Field("Loam / Clay-Loam", description="Soil texture type")
    growth_stage: Optional[str] = Field("Vegetative", description="Current growth stage: Seedling, Vegetative, Flowering, Fruiting/Maturity")
    latitude: Optional[float] = Field(25.3960, description="Latitude for weather retrieval")
    longitude: Optional[float] = Field(68.3578, description="Longitude for weather retrieval")

class IrrigationResponse(BaseModel):
    crop: str
    location: str
    soil_type: str
    growth_stage: str
    watering_advice: str
    urgency: str = Field(description="low, normal, high, hold")
    soil_moisture_estimate: str
    weather_summary: Optional[Dict[str, Any]] = None
    guidelines: List[str] = Field(default_factory=list)
    data_source: str = Field(default="Open-Meteo Agricultural & Agro-meteorology API")
