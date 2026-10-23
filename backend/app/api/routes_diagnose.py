from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.scan import ScanRecord
from app.schemas.diagnosis import CropDiagnosisResponse
from app.services.image_service import validate_and_process_image
from app.services.gemini_service import gemini_service
from app.core.logging import logger

router = APIRouter(tags=["Crop Diagnosis"])

@router.post("/diagnose", response_model=CropDiagnosisResponse)
async def diagnose_crop_image(
    file: UploadFile = File(..., description="Crop leaf photograph (JPEG, PNG, WebP up to 8MB)"),
    crop: Optional[str] = Form(None, description="Optional user-selected crop (e.g. Cotton, Wheat, Rice)"),
    symptoms: Optional[str] = Form(None, description="Optional observed symptoms"),
    language: str = Form("en", description="Preferred response language: en, ur, or sd"),
    db: Session = Depends(get_db)
):
    """
    Accepts an uploaded crop leaf photo, validates image integrity, analyzes it
    using Google Gemini Vision AI, persists the diagnosis to the database, and returns
    structured agricultural advice.
    """
    # Read upload contents safely
    try:
        file_bytes = await file.read()
    except Exception as e:
        logger.error(f"Failed to read uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to read uploaded file."
        )

    # 1. Image validation & resizing
    processed_bytes, mime_type, thumb_b64 = validate_and_process_image(
        file_bytes, filename=file.filename or "upload.jpg"
    )

    # 2. AI Inference
    diagnosis_result = gemini_service.analyze_crop_image(
        image_bytes=processed_bytes,
        mime_type=mime_type,
        crop_type=crop,
        symptoms_note=symptoms,
        language=language
    )

    # 3. Persist to database
    try:
        scan_record = ScanRecord(
            crop_type=diagnosis_result.crop or (crop or "Unknown"),
            plant_status=diagnosis_result.plant_status,
            diagnosis_name=diagnosis_result.diagnosis.name if diagnosis_result.diagnosis else "Unspecified",
            confidence=diagnosis_result.diagnosis.confidence if diagnosis_result.diagnosis else None,
            analysis_summary=diagnosis_result.diagnosis.reasoning_summary if diagnosis_result.diagnosis else "",
            symptoms=diagnosis_result.symptoms,
            possible_causes=diagnosis_result.possible_causes,
            recommended_actions=diagnosis_result.recommended_actions,
            prevention=diagnosis_result.prevention,
            urgency=diagnosis_result.urgency,
            language=diagnosis_result.language,
            image_data=thumb_b64
        )
        db.add(scan_record)
        db.commit()
        db.refresh(scan_record)

        diagnosis_result.id = scan_record.id
        diagnosis_result.image_data = thumb_b64
        diagnosis_result.created_at = scan_record.created_at.isoformat()
    except Exception as e:
        logger.error(f"Failed to save scan to database: {e}", exc_info=True)
        # We don't fail the diagnosis if DB write had an issue, but we log it
        db.rollback()

    return diagnosis_result
