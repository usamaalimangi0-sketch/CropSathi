import io
import base64
from typing import Tuple
from PIL import Image, UnidentifiedImageError
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from app.core.logging import logger

SUPPORTED_FORMATS = {"JPEG", "JPG", "PNG", "WEBP"}
SUPPORTED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

class ImageValidationResult:
    def __init__(self, is_valid: bool, error: str = "", mime_type: str = "", image_bytes: bytes = b"", thumbnail_b64: str = ""):
        self.is_valid = is_valid
        self.error = error
        self.mime_type = mime_type
        self.image_bytes = image_bytes
        self.thumbnail_b64 = thumbnail_b64

def validate_and_process_image(file_bytes: bytes, filename: str = "upload.jpg") -> Tuple[bytes, str, str]:
    """
    Validates that uploaded bytes form a genuine, non-corrupted image in supported format.
    Resizes if overly large to prevent API timeouts.
    Returns: (processed_bytes, mime_type, thumbnail_b64)
    Raises: HTTPException with clear error details.
    """
    # 1. Size check
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"IMAGE_TOO_LARGE: File size exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit."
        )
    
    if len(file_bytes) < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="INVALID_IMAGE: File content is too small to be a valid image."
        )

    # 2. Decode and verify image integrity
    try:
        pil_image = Image.open(io.BytesIO(file_bytes))
        format_name = (pil_image.format or "").upper()
        
        # Verify supported format
        if format_name not in SUPPORTED_FORMATS:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"UNSUPPORTED_IMAGE: Format '{format_name}' is not supported. Please upload JPEG, PNG, or WebP."
            )
        
        # Verify image structure
        pil_image.verify()
        
        # Re-open for operations since verify() closes/invalidates the image
        pil_image = Image.open(io.BytesIO(file_bytes))
        
        # Convert RGBA/Palette/Grayscale to RGB for standardized processing
        if pil_image.mode in ("RGBA", "P", "LA"):
            pil_image = pil_image.convert("RGB")
        elif pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
            
        width, height = pil_image.size
        if width < 50 or height < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="INVALID_IMAGE: Image dimensions are too small for accurate leaf analysis (minimum 50x50)."
            )

        # 3. Optimize resolution if image is huge (keep within 1600x1600 max)
        max_dim = 1600
        if width > max_dim or height > max_dim:
            pil_image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

        # 4. Export processed JPEG bytes
        output_buffer = io.BytesIO()
        pil_image.save(output_buffer, format="JPEG", quality=88, optimize=True)
        processed_bytes = output_buffer.getvalue()
        mime_type = "image/jpeg"

        # 5. Generate lightweight thumbnail for UI preview & DB persistence (max 400x400)
        thumb_image = pil_image.copy()
        thumb_image.thumbnail((400, 400), Image.Resampling.LANCZOS)
        thumb_buffer = io.BytesIO()
        thumb_image.save(thumb_buffer, format="JPEG", quality=75, optimize=True)
        thumb_b64 = "data:image/jpeg;base64," + base64.b64encode(thumb_buffer.getvalue()).decode("utf-8")

        return processed_bytes, mime_type, thumb_b64

    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="INVALID_IMAGE: The uploaded file is not a valid image or is corrupted."
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Image validation unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"INVALID_IMAGE: Could not decode image: {str(e)}"
        )
