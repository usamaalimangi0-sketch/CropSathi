from typing import List, Optional
from pydantic import BaseModel, Field

class DiagnosisInfo(BaseModel):
    name: str = Field(..., description="Name of the identified disease or 'Healthy'")
    confidence: Optional[float] = Field(None, description="Calibrated confidence score between 0.0 and 1.0, or null if uncertain")
    reasoning_summary: str = Field(..., description="Visible evidence and reasoning behind the assessment")

class CropDiagnosisResponse(BaseModel):
    id: Optional[str] = Field(None, description="Unique scan ID if persisted")
    crop: str = Field(..., description="Crop type analyzed, e.g. cotton, wheat, rice, tomato")
    image_quality: str = Field(..., description="Assessment of image quality: good, low, blurry, unclear")
    plant_status: str = Field(..., description="healthy, possibly_diseased, unclear, or unsupported")
    diagnosis: DiagnosisInfo
    symptoms: List[str] = Field(default_factory=list, description="Visible leaf or plant symptoms")
    possible_causes: List[str] = Field(default_factory=list, description="Biological, environmental or pest causes")
    recommended_actions: List[str] = Field(default_factory=list, description="Practical, prioritized next steps")
    prevention: List[str] = Field(default_factory=list, description="Long-term cultural and preventive practices")
    urgency: str = Field(default="moderate", description="low, moderate, high, or critical")
    language: str = Field(default="en", description="Response language: en or ur")
    disclaimer: str = Field(
        default="AI-generated guidance for educational and decision support. Please verify critical or uncertain crop conditions with a certified local agronomist or agricultural extension officer.",
        description="Agricultural guidance disclaimer"
    )
    image_data: Optional[str] = Field(None, description="Base64 thumbnail representation of analyzed image")
    created_at: Optional[str] = Field(None, description="ISO timestamp")
    is_mock: bool = Field(default=False, description="Whether this is a synthetic mock result")

class ScanListItem(BaseModel):
    id: str
    crop: str
    plant_status: str
    diagnosis_name: Optional[str]
    confidence: Optional[float]
    analysis_summary: Optional[str]
    urgency: str
    created_at: Optional[str]
    image_data: Optional[str]

class ScanListResponse(BaseModel):
    total: int
    items: List[ScanListItem]
