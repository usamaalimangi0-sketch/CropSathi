from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.scan import ScanRecord
from app.models.user import User
from app.core.security import get_current_user_optional
from app.schemas.diagnosis import ScanListResponse, ScanListItem, CropDiagnosisResponse, DiagnosisInfo

router = APIRouter(prefix="/scans", tags=["Scan History"])

@router.get("", response_model=ScanListResponse)
def list_scans(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    search: Optional[str] = Query(None, description="Search term for diagnosis or crop"),
    plant_status: Optional[str] = Query(None, description="Filter by status: healthy, possibly_diseased, unclear"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieve saved scans with optional search and filters."""
    query = db.query(ScanRecord)

    # Filter scans to the current user if logged in; if guest, show guest records or demo scans
    if current_user:
        query = query.filter(ScanRecord.user_id == current_user.id)
    else:
        query = query.filter(ScanRecord.user_id.is_(None))

    if crop:
        query = query.filter(ScanRecord.crop_type.ilike(f"%{crop}%"))
    if plant_status:
        query = query.filter(ScanRecord.plant_status == plant_status)
    if search:
        query = query.filter(
            (ScanRecord.crop_type.ilike(f"%{search}%")) |
            (ScanRecord.diagnosis_name.ilike(f"%{search}%")) |
            (ScanRecord.analysis_summary.ilike(f"%{search}%"))
        )

    total = query.count()
    records = query.order_by(desc(ScanRecord.created_at)).offset(offset).limit(limit).all()

    items = [
        ScanListItem(
            id=r.id,
            crop=r.crop_type,
            plant_status=r.plant_status,
            diagnosis_name=r.diagnosis_name,
            confidence=r.confidence,
            analysis_summary=r.analysis_summary,
            urgency=r.urgency,
            created_at=r.created_at.isoformat() if r.created_at else None,
            image_data=r.image_data
        )
        for r in records
    ]

    return ScanListResponse(total=total, items=items)

@router.get("/{scan_id}", response_model=CropDiagnosisResponse)
def get_scan_detail(scan_id: str, db: Session = Depends(get_db)):
    """Retrieve full details of a specific scan by ID."""
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan record with ID '{scan_id}' not found."
        )

    return CropDiagnosisResponse(
        id=record.id,
        crop=record.crop_type,
        image_quality="good",
        plant_status=record.plant_status,
        diagnosis=DiagnosisInfo(
            name=record.diagnosis_name or "Healthy / Unspecified",
            confidence=record.confidence,
            reasoning_summary=record.analysis_summary or ""
        ),
        symptoms=record.symptoms or [],
        possible_causes=record.possible_causes or [],
        recommended_actions=record.recommended_actions or [],
        prevention=record.prevention or [],
        urgency=record.urgency,
        language=record.language or "en",
        image_data=record.image_data,
        created_at=record.created_at.isoformat() if record.created_at else None
    )

@router.delete("/{scan_id}", status_code=status.HTTP_200_OK)
def delete_scan(scan_id: str, db: Session = Depends(get_db)):
    """Safely delete a saved scan record."""
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan record with ID '{scan_id}' not found."
        )
    
    db.delete(record)
    db.commit()
    return {"message": "Scan deleted successfully", "id": scan_id}
