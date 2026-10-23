# CropSathi AI — Your Intelligent Farming Companion
> **Smart Farming. Healthier Crops. Better Decisions.**  
> Built for the **DITE Hackathon 2026–27** | Hyderabad, Sindh, Pakistan  
> **Theme:** Artificial Intelligence & Sustainable Agriculture

---

## 1. Project Overview & Vision

**CropSathi AI** is a full-stack, AI-driven agricultural pathology and advisory companion designed specifically for small-to-medium scale farmers in Pakistan. 

Smallholder farmers in Sindh, Punjab, Khyber Pakhtunkhwa, and Balochistan frequently confront debilitating crop diseases (such as Cotton Leaf Curl Virus, Wheat Rust, and Rice Blast) without immediate access to certified agronomists or extension workers. Misdiagnosing these diseases often leads to either catastrophic crop loss or wasteful, toxic over-application of unregistered chemical pesticides.

**Core Value Proposition:**  
*Upload a crop photo. Understand the possible problem. Learn what to do next.*

CropSathi AI combines **Google Gemini Multimodal Vision AI** with localized agronomic knowledge, real-time agro-meteorological observations from **Open-Meteo**, and full multilingual support in **English, Urdu (اردو), and Sindhi (سنڌي)** to provide accessible, actionable diagnostic support right from budget smartphones.

---

## 2. Key Features

- **Multimodal AI Leaf Disease Diagnosis (`/diagnose`):**
  - Accepts genuine field photographs (JPEG, PNG, WebP up to 8MB).
  - Validates image integrity using PIL (rejects corrupted files, non-images, and sub-resolution files).
  - Analyzes visible visual leaf symptoms (curling, chlorosis, fungal pustules, necrotic spots) using Google Gemini Vision.
  - Zero-hallucination guardrails: clearly distinguishes healthy, diseased, unclear, and unsupported images.
  - Provides plain-language explanations, symptoms, probable causes, prioritized action plans, and cultural prevention practices.

- **Multilingual Support (English, Urdu, Sindhi):**
  - Instant translation and localized explanations in Pakistani national (Urdu) and regional (Sindhi) languages.

- **AI Farming Assistant (`/assistant`):**
  - Context-aware conversational AI assistant specializing in Pakistani agronomy.
  - Answers questions on Integrated Pest Management (IPM), fertilizer application schedules, soil health, and weather adaptation.
  - Contextually pre-loaded from diagnosis results to seamlessly answer follow-up treatment queries.

- **Smart Irrigation Advisor (`/irrigation`):**
  - Real-time weather and agro-meteorology integration via the Open-Meteo API.
  - Live temperature, relative humidity, precipitation, and soil moisture data across 11 key Pakistani agricultural districts (Hyderabad, Sukkur, Larkana, Mirpurkhas, Nawabshah, Multan, Faisalabad, Bahawalpur, Sahiwal, Peshawar, Quetta).
  - Computes tailored watering recommendations and cautionary notices (e.g. holding irrigation during rainfall or adjusting for extreme heat stress).

- **Local Scan History (`/history`):**
  - Saved diagnosis history stored in a local SQLite database.
  - Search by crop name, disease diagnosis, or symptoms.
  - Filter by plant status (All, Diseased, Healthy, Unclear).
  - Detailed view modal and safe deletion with confirmation.

- **Agro-Advisory & Safety Guardrails:**
  - Emphasizes Integrated Pest Management (IPM) and approved agricultural standards rather than prescribing unverified chemical dosages.
  - Transparent agricultural disclaimers advising confirmation with local extension officers for critical conditions.

---

## 3. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Browser Client (React 18 + Vite + TS)                │
│   Tailwind CSS  •  Lucide Icons  •  Responsive Mobile/Desktop Layout   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ HTTP / REST & Multipart
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      FastAPI Backend Service (Python 3.11+)            │
│   Pydantic Validation  •  CORS  •  PIL Image Validation & Thumbnails   │
└───┬────────────────────────────────┬───────────────────────────────┬───┘
    │                                │                               │
    ▼                                ▼                               ▼
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   Google Gemini API     │  │     SQLite Database     │  │     Open-Meteo API      │
│  (Multimodal Vision &   │  │   (SQLAlchemy 2.0 ORM   │  │  (Real-time Agromet &   │
│   Agri Chat Assistant)  │  │   Scan History Storage) │  │   Weather Observations) │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

---

## 4. Technology Stack

### Frontend
- **Framework:** React 18 with Vite and TypeScript
- **Styling:** Tailwind CSS with custom agricultural color palette (`agri-*`, `harvest-*`)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **HTTP Client:** Axios with centralized error and timeout handling

### Backend
- **Framework:** FastAPI (Python 3.11 / 3.15)
- **Data Validation:** Pydantic v2
- **Database / ORM:** SQLite with SQLAlchemy 2.0
- **Image Processing:** Pillow (PIL) for structure verification, format decoding, and thumbnail generation
- **HTTP Client:** HTTPX for asynchronous external API requests

### Artificial Intelligence & Data Services
- **AI Vision & Assistant:** Google Gemini Developer API via official `google-genai` Python SDK
- **Model:** `gemini-2.5-flash` (or `gemini-1.5-flash`)
- **Agro-Meteorology API:** Open-Meteo Free API (no credentials required)

---

## 5. Repository Structure

```
cropsathi-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes_diagnose.py    # Image upload & Gemini vision diagnosis
│   │   │   ├── routes_chat.py        # Conversational farming assistant
│   │   │   ├── routes_scans.py       # Scan history CRUD
│   │   │   ├── routes_irrigation.py  # Open-Meteo smart irrigation advisor
│   │   │   └── routes_health.py      # Health & AI configuration check
│   │   ├── core/
│   │   │   ├── config.py             # Settings & environment variables
│   │   │   └── logging.py            # Structured logging
│   │   ├── models/
│   │   │   └── scan.py               # SQLAlchemy ScanRecord model
│   │   ├── schemas/
│   │   │   ├── diagnosis.py          # Pydantic schemas for vision diagnosis
│   │   │   ├── chat.py               # Pydantic schemas for chat
│   │   │   └── irrigation.py        # Pydantic schemas for irrigation
│   │   ├── services/
│   │   │   ├── gemini_service.py     # Multimodal Gemini API integration
│   │   │   ├── image_service.py      # PIL image validation & thumbnailing
│   │   │   └── weather_service.py    # Open-Meteo agro-meteorology integration
│   │   ├── database.py               # SQLite connection & table initialization
│   │   └── main.py                   # FastAPI app entry point & CORS
│   ├── tests/
│   │   └── test_backend.py           # Automated pytest suite (7 passing tests)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AiStatusBanner.tsx    # Live Gemini status & key setup guide
│   │   │   └── DiagnosisResultCard.tsx # Detailed diagnosis results card
│   │   ├── layouts/
│   │   │   ├── Navbar.tsx            # Header navigation with mobile drawer
│   │   │   └── Footer.tsx            # Footer with hackathon details & disclaimer
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx         # Welcome hero, status, recent scans, tips
│   │   │   ├── Diagnose.tsx          # Drag-and-drop leaf photo diagnosis
│   │   │   ├── Assistant.tsx         # Multilingual farming chat assistant
│   │   │   ├── Irrigation.tsx        # Smart weather-based irrigation advisor
│   │   │   ├── History.tsx           # Searchable scan history list & modal
│   │   │   └── About.tsx             # Photo guide, supported crops, disclaimers
│   │   ├── services/
│   │   │   └── api.ts                # Centralized Axios API service
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   ├── App.tsx                   # Main React routes
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Tailwind CSS & Urdu/Sindhi font utilities
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── sample_images/                    # Pre-generated sample leaf photos for testing
│   ├── cotton_leaf_curl_sample.jpg
│   ├── wheat_rust_sample.jpg
│   └── healthy_rice_leaf_sample.jpg
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 6. Installation & Local Setup

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

### Step 1: Clone the Repository
```bash
git clone <YOUR_PUBLIC_GITHUB_REPO_URL>
cd "CROP SATHI"
```

### Step 2: Backend Configuration & Startup
```bash
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env
copy .env.example .env   # (or cp .env.example .env on Linux/macOS)
```

Edit `backend/.env` to configure your Google Gemini API key:
```ini
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=sqlite:///./cropsathi.db
FRONTEND_ORIGIN=http://localhost:5173
```
> *You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/). If the key is not set initially, the app displays a setup guidance banner without crashing.*

Start the FastAPI server:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now running at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### Step 3: Frontend Configuration & Startup
Open a second terminal window:
```bash
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 7. Running with Docker Compose

To run the complete full-stack environment in isolated containers:
```bash
# Ensure docker-compose is installed
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 8. Automated Testing

The project includes an automated test suite verifying core system integrity, validation rules, and end-to-end diagnosis persistence:

```bash
# From the project root:
python -m pytest backend/tests/test_backend.py -v
```

### Test Suite Results:
- `test_health_endpoint`: Verifies `/api/health` status and database connectivity.
- `test_ai_health_endpoint`: Verifies `/api/health/ai` reporting without exposing secret credentials.
- `test_reject_non_image_file`: Verifies that uploading corrupted files or scripts disguised as images returns `400 INVALID_IMAGE`.
- `test_reject_unsupported_image_format`: Rejects unsupported formats (e.g. BMP) with `415 UNSUPPORTED_IMAGE`.
- `test_reject_tiny_dimensions`: Rejects sub-resolution images (< 50x50 px) insufficient for diagnosis.
- `test_successful_crop_diagnosis_and_scan_flow`: Executes the complete upload -> inference -> database persistence -> scan listing -> detail retrieval -> deletion lifecycle.
- `test_smart_irrigation_advisor_endpoint`: Verifies live calculation of smart irrigation guidance for crops based on weather metrics.

**Status:** 7 of 7 automated tests passing.

---

## 9. Sample Test Images for Judging / Demonstration

For convenience during hackathon judging and live demonstrations, sample leaf images are provided in the `sample_images/` folder:
1. `sample_images/cotton_leaf_curl_sample.jpg`: Demonstrates diagnostic detection for cotton leaf curl symptoms.
2. `sample_images/wheat_rust_sample.jpg`: Demonstrates wheat blade rust detection.
3. `sample_images/healthy_rice_leaf_sample.jpg`: Demonstrates healthy crop classification.

---

## 10. AI Input and Output Schema

### Vision Diagnosis Endpoint (`POST /api/diagnose`)
**Input:** Multipart Form Data (`file: UploadFile`, `crop: Optional[str]`, `symptoms: Optional[str]`, `language: str`)

**Output JSON Structure:**
```json
{
  "id": "c1f7b098-9031-4890-a29d-47816cb17b89",
  "crop": "Cotton",
  "image_quality": "good",
  "plant_status": "possibly_diseased",
  "diagnosis": {
    "name": "Cotton Leaf Curl Virus (CLCuV)",
    "confidence": null,
    "reasoning_summary": "Upward curling of leaf margins, leaf enations and vein thickening characteristic of geminivirus transmitted by whitefly."
  },
  "symptoms": [
    "Upward curling of leaves",
    "Thickened veins",
    "Enations on lower leaf surface"
  ],
  "possible_causes": [
    "Cotton Leaf Curl Begomovirus",
    "Whitefly (Bemisia tabaci) vector"
  ],
  "recommended_actions": [
    "Monitor whitefly population using yellow sticky traps",
    "Remove severely infected rogue plants",
    "Consult local extension officer for approved IPM measures"
  ],
  "prevention": [
    "Sow CLCuV-resistant cotton varieties",
    "Manage weed hosts near field boundaries",
    "Avoid excessive nitrogen fertilizer"
  ],
  "urgency": "high",
  "language": "en",
  "disclaimer": "AI-generated diagnostic guidance for educational and decision support. Please verify critical crop conditions with a certified local agronomist before applying chemical treatments.",
  "image_data": "data:image/jpeg;base64,...",
  "created_at": "2026-10-23T08:06:11.607441"
}
```

---

## 11. Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Push code to your public GitHub repository.
2. Link repository to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set **Root Directory** to `frontend`.
4. Set build command: `npm run build` and output directory: `dist`.
5. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-app.onrender.com/api`

### Backend Deployment (Render / Railway)
1. Link repository to [Render](https://render.com).
2. Choose **Web Service** with **Root Directory** set to `backend`.
3. Set build command: `pip install -r requirements.txt`.
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Add environment variables:
   - `GEMINI_API_KEY=<your-google-gemini-api-key>`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `FRONTEND_ORIGIN=https://your-frontend-app.vercel.app`
   - `DATABASE_URL=sqlite:///./cropsathi.db`

---

## 12. Attribution & Acknowledgments

- **Google Gemini API:** Multimodal AI model providing vision and natural language processing.
- **Open-Meteo:** Free, open-access agro-meteorological observations and weather forecasts.
- **DITE Hackathon 2026–27 Organizers:** Hyderabad, Sindh, Pakistan for championing AI in agriculture.
- **Pakistan Agricultural Research Council (PARC) & Sindh Agriculture Extension:** Reference agronomic guidelines on regional pest management and crop calendars.

---

## 13. Hackathon Submission Checklist

- [x] Complete connected working application (Frontend + Backend + AI + Database).
- [x] Real multimodal AI integration (Google Gemini Vision).
- [x] Database persistence for scan history (SQLite).
- [x] Multilingual support (English, Urdu, Sindhi).
- [x] Smart irrigation advisor with live weather data.
- [x] Automated test suite passing (7/7 tests).
- [x] Dockerfile and `docker-compose.yml` configured.
- [x] Zero hardcoded / fabricated diagnoses.
- [x] Comprehensive documentation and setup instructions.
- [x] Sample test images provided in `sample_images/`.
