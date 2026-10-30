# app.services.gemini_service
import json
import re
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.core.config import settings
from app.core.logging import logger
from app.schemas.diagnosis import CropDiagnosisResponse, DiagnosisInfo
from app.schemas.chat import ChatMessage, ChatResponse

HINDI_TO_URDU_MAP = {
    'स्थानीय': 'مقامی',
    'उपाय': 'تدابیر',
    'किसान': 'کسان',
    'खेत': 'کھیت',
    'पौधे': 'پودے',
    'रोग': 'بیماری',
    'इलाज': 'علاج',
    'सलाह': 'مشورہ',
    'कृषि': 'زرعی',
    'दवा': 'دوا',
    'दवाएं': 'ادویات',
    'कीटनाशक': 'کیڑے مار ادویات',
    'खाद': 'کھاد',
    'लक्षण': 'علامات',
    'कारण': 'وجوہات',
    'रोकथाम': 'روک تھام',
}

def sanitize_text(text: str) -> str:
    """Sanitize Urdu/Sindhi text to eliminate Hindi Devanagari script leaks and unrendered asterisks."""
    if not isinstance(text, str):
        return text
    # 1. Replace known Hindi vocabulary with Urdu equivalent
    for hi, ur in HINDI_TO_URDU_MAP.items():
        text = text.replace(hi, ur)
    # 2. Strip any remaining Devanagari Unicode characters (\u0900-\u097F)
    text = re.sub(r'[\u0900-\u097F]+', '', text)
    # 3. Strip markdown asterisks that create unprofessional raw '*' artifacts in UI
    text = text.replace('**', '').replace('*', '')
    # 4. Clean extra whitespace
    text = re.sub(r'\s{2,}', ' ', text).strip()
    return text

def sanitize_data(data: Any) -> Any:
    """Recursively clean dictionaries, lists, and strings from Hindi/Devanagari characters."""
    if isinstance(data, dict):
        return {k: sanitize_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, str):
        return sanitize_text(data)
    return data

class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._init_client()

    def _init_client(self):
        if settings.is_gemini_configured():
            try:
                self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info(f"Gemini Client initialized with model {settings.GEMINI_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
                self._client = None
        else:
            self._client = None
            logger.warning("Gemini API key is not configured. Set GEMINI_API_KEY in backend/.env")

    def get_client(self) -> genai.Client:
        # Re-check in case .env was updated at runtime
        if self._client is None and settings.is_gemini_configured():
            self._init_client()
        if self._client is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI_SERVICE_UNAVAILABLE: Gemini API key is not configured. Please add GEMINI_API_KEY in backend/.env to enable real AI diagnosis."
            )
        return self._client

    def _clean_json_text(self, text: str) -> str:
        """Strip markdown code fence if model wrapped output in ```json ... ```"""
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text

    def analyze_crop_image(
        self,
        image_bytes: bytes,
        mime_type: str,
        crop_type: Optional[str] = None,
        symptoms_note: Optional[str] = None,
        language: str = "en"
    ) -> CropDiagnosisResponse:
        """
        Sends actual image and context to Google Gemini vision model and parses structured JSON diagnosis.
        """
        client = self.get_client()

        # Language instructions
        lang_prompt = {
            "en": "Respond strictly in clear agronomic English.",
            "ur": (
                "CRITICAL LANGUAGE RULE FOR URDU: Output MUST be 100% pure authentic Pakistani Urdu in standard Urdu/Nastaliq Arabic script (اردو). "
                "STRICTLY FORBIDDEN: Do NOT include ANY Hindi words or Devanagari script characters (e.g. NEVER write 'स्थानीय', 'उपाय', 'कृषि'). "
                "Always use standard Urdu terms: 'مقامی' for local, 'احتیاطی تدابیر' for measures, 'زرعی ماہر' for agronomist."
            )
        }.get(language, "Respond in English.")

        system_instruction = f"""
You are CropSathi AI, an expert agricultural pathologist and agronomist specializing in Pakistani crop health (including Wheat, Rice, Cotton, Sugarcane, Maize, Tomato, Chilli, Mango, Citrus, Onion, Potato, etc.).

Analyze the provided crop-leaf photograph carefully.

CRITICAL DIAGNOSTIC RULES:
1. Examine the ACTUAL uploaded image features (color, chlorosis, necrosis, lesions, fungal sporulation, insect damage, curling, mosaic patterns, or healthy green leaf tissue).
2. Distinguish:
   - "healthy": leaf displays normal healthy vigor with no pathogen symptoms.
   - "possibly_diseased": identifiable symptoms of fungal, bacterial, viral, or pest damage.
   - "unclear": image is too blurry, dark, low-resolution, or out-of-focus to determine with confidence.
   - "unsupported": the image does not show a plant, crop, or leaf.
3. User provided crop preference: '{crop_type or 'Not specified'}'. Verify if the visual evidence matches this crop. If user selected 'Cotton' but image is a tomato or non-plant, reflect this objectively.
4. User observed symptoms: '{symptoms_note or 'None provided'}'.
5. Do NOT invent confidence percentages. Set "confidence": null unless a rigorous calibrated score is justified.
6. Do NOT prescribe dangerous, unverified pesticide quantities or chemical mixtures. Emphasize Integrated Pest Management (IPM), proper scouting, cultural practices, and consultation with registered local agricultural extension workers.
7. {lang_prompt}

You must return a single valid JSON object matching this EXACT schema:
{{
  "crop": "<detected or stated crop name>",
  "image_quality": "<good | low | blurry | unclear>",
  "plant_status": "<healthy | possibly_diseased | unclear | unsupported>",
  "diagnosis": {{
    "name": "<Disease name or 'Healthy' or 'Uncertain / Non-plant'>",
    "confidence": null,
    "reasoning_summary": "<Objective visible evidence explaining the assessment>"
  }},
  "symptoms": ["<list of observed symptoms>"],
  "possible_causes": ["<list of contributing biological/environmental causes>"],
  "recommended_actions": ["<prioritized, safe, practical next steps for the farmer>"],
  "prevention": ["<preventive measures and best agricultural practices>"],
  "urgency": "<low | moderate | high | critical>",
  "language": "{language}",
  "disclaimer": "AI-generated diagnostic guidance for educational and decision support. Please verify critical crop conditions with a certified local agronomist before applying chemical treatments."
}}
"""

        try:
            import io
            from PIL import Image
            pil_img = Image.open(io.BytesIO(image_bytes))

            prompt_contents = [
                pil_img,
                f"Please inspect this leaf photo and provide your agricultural assessment following the system guidelines in {language} language."
            ]

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt_contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )

            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI_RESPONSE_INVALID: Model returned empty response."
                )

            clean_json = self._clean_json_text(response.text)
            parsed_data = json.loads(clean_json)

            # Sanitize output data to eliminate any stray Hindi/Devanagari characters
            parsed_data = sanitize_data(parsed_data)

            # Defensive normalization: ensure diagnosis sub-dict has required fields even if LLM keyed it differently
            if isinstance(parsed_data.get("diagnosis"), dict):
                diag = parsed_data["diagnosis"]
                if "reasoning_summary" not in diag or not diag["reasoning_summary"]:
                    diag["reasoning_summary"] = (
                        diag.get("reasoning")
                        or diag.get("summary")
                        or diag.get("evidence")
                        or diag.get("explanation")
                        or diag.get("description")
                        or "Visual symptoms inspected."
                    )
            elif not parsed_data.get("diagnosis"):
                parsed_data["diagnosis"] = {"name": "Healthy", "confidence": None, "reasoning_summary": "No pathogen detected."}

            # Validate against Pydantic schema
            diagnosis_obj = CropDiagnosisResponse(**parsed_data)
            return diagnosis_obj

        except json.JSONDecodeError as jde:
            logger.error(f"Failed to parse Gemini JSON output: {jde}. Raw text: {response.text}")
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI_RESPONSE_INVALID: Could not parse structured JSON response from vision model."
            )
        except APIError as ae:
            logger.error(f"Gemini API Error: {ae}")
            err_str = str(ae)
            if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="AI_RATE_LIMITED: Gemini API rate limit or quota exceeded. Please wait a moment and try again."
                )
            if "PERMISSION_DENIED" in err_str or "403" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Gemini API Key Permission Denied: The current API key does not have the Gemini API free tier enabled (free tier is not available for this project/account). Please get a free API key from https://aistudio.google.com/app/apikey (choose 'Create API key in new project')."
                )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI_SERVICE_UNAVAILABLE: Gemini API error: {err_str}"
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error in analyze_crop_image: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI_PROCESSING_ERROR: Failed to analyze image: {str(e)}"
            )

    def chat_assistant(
        self,
        message: str,
        history: List[ChatMessage],
        crop_context: Optional[str] = None,
        language: str = "en"
    ) -> ChatResponse:
        """
        Conversational agriculture expert answering farmer questions in English, Urdu, or Sindhi.
        """
        client = self.get_client()

        lang_instruction = {
            "en": "Respond in clear, accessible English.",
            "ur": (
                "CRITICAL: Respond STRICTLY in pure Pakistani Urdu in standard Urdu/Nastaliq script (اردو). "
                "DO NOT use ANY Hindi words or Devanagari script (like 'स्थानीय', 'उपाय'). Always use standard Urdu ('مقامی', 'تدابیر')."
            )
        }.get(language, "Respond in clear English.")

        system_instruction = f"""
You are CropSathi AI Farming Assistant, a friendly, knowledgeable agronomist dedicated to assisting Pakistani farmers with practical agricultural guidance.

GUIDELINES:
1. Focus strictly on agriculture, agronomy, soil health, crop diseases, pest management, irrigation, fertilizers, weather adaptation, and best harvesting practices in Pakistan (Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan).
2. If the user asks something completely unrelated to agriculture or rural livelihood, politely redirect them back to farming topics.
3. Context: Current crop context is '{crop_context or 'General farming'}'.
4. Never invent specific toxic pesticide doses or unregulated chemical recipes. Always advise following registered bottle labels, protective gear, and local extension service advice.
5. {lang_instruction}
6. Always include 2 or 3 brief, relevant follow-up questions at the end to guide the farmer.

Output JSON format:
{{
  "reply": "<Your practical response in the requested language>",
  "suggested_followups": ["<Follow-up question 1>", "<Follow-up question 2>", "<Follow-up question 3>"],
  "language": "{language}"
}}
"""

        # Build turn contents
        contents = []
        for turn in history[-6:]:  # last 6 turns for context
            role_label = "user" if turn.role == "user" else "model"
            contents.append(f"{role_label.upper()}: {turn.content}")

        contents.append(f"USER: {message}")

        try:
            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )

            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Empty response from AI assistant."
                )

            clean_json = self._clean_json_text(response.text)
            data = json.loads(clean_json)
            data = sanitize_data(data)
            return ChatResponse(
                reply=data.get("reply", response.text),
                suggested_followups=data.get("suggested_followups", []),
                language=language
            )

        except APIError as ae:
            logger.error(f"Gemini API Error in chat: {ae}")
            err_str = str(ae)
            if "PERMISSION_DENIED" in err_str or "403" in err_str:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Gemini API Key Permission Denied: Please generate a free API key from https://aistudio.google.com/app/apikey (choose 'Create API key in new project')."
                )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI_SERVICE_UNAVAILABLE: {err_str}"
            )
        except Exception as e:
            logger.error(f"Chat assistant error: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing question: {str(e)}"
            )

gemini_service = GeminiService()
