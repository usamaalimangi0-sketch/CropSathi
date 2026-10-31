from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthResponse,
    UserProfileResponse
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.core.logging import logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new farmer / user account with mobile number or email."""
    normalized_identifier = payload.phone_or_email.strip().lower()

    # Check if user already exists
    existing_user = db.query(User).filter(User.phone_or_email == normalized_identifier).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number or email already exists. Please sign in."
        )

    # Hash password with fresh salt
    hashed_pw, salt = hash_password(payload.password)

    new_user = User(
        phone_or_email=normalized_identifier,
        full_name=payload.full_name.strip(),
        district=payload.district.strip() if payload.district else "Pakistan",
        hashed_password=hashed_pw,
        salt=salt,
        is_active=True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT access token
    access_token = create_access_token(
        data={"sub": new_user.id, "email": new_user.phone_or_email}
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserProfileResponse(
            id=new_user.id,
            phone_or_email=new_user.phone_or_email,
            full_name=new_user.full_name,
            district=new_user.district,
            created_at=new_user.created_at.isoformat() if new_user.created_at else None
        )
    )

@router.post("/login", response_model=AuthResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate an existing user and return a JWT access token."""
    normalized_identifier = payload.phone_or_email.strip().lower()

    user = db.query(User).filter(User.phone_or_email == normalized_identifier).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number/email or password."
        )

    if not verify_password(payload.password, user.hashed_password, user.salt):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mobile number/email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )

    access_token = create_access_token(
        data={"sub": user.id, "email": user.phone_or_email}
    )

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserProfileResponse(
            id=user.id,
            phone_or_email=user.phone_or_email,
            full_name=user.full_name,
            district=user.district,
            created_at=user.created_at.isoformat() if user.created_at else None
        )
    )

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Return profile information of the currently authenticated user."""
    return UserProfileResponse(
        id=current_user.id,
        phone_or_email=current_user.phone_or_email,
        full_name=current_user.full_name,
        district=current_user.district,
        created_at=current_user.created_at.isoformat() if current_user.created_at else None
    )
