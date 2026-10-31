from typing import List, Dict, Any, Optional

PAKISTAN_AGRI_DEALERS: List[Dict[str, Any]] = [
    # Sukkur & Upper Sindh
    {
        "id": "engro_sukkur_hub",
        "name": "Engro Fertilizer & Crop Care Hub",
        "partner_brand": "Engro Fertilizers",
        "district": "Sukkur, Sindh",
        "address": "Bunder Road, Near Grain Market, Sukkur",
        "phone": "+92 71 5623891",
        "whatsapp": "923005551234",
        "verified": True,
        "specialties": ["Urea", "DAP", "Zorawar", "Fungicides", "Cotton Spray"],
        "rating": 4.9
    },
    {
        "id": "fmc_sukkur_solutions",
        "name": "FMC Agricultural Solutions Centre",
        "partner_brand": "FMC Pakistan",
        "district": "Sukkur, Sindh",
        "address": "Main Shikarpur Road, Sukkur",
        "phone": "+92 71 5801243",
        "whatsapp": "923015552345",
        "verified": True,
        "specialties": ["Coragen", "Tebuconazole", "Insecticides", "Wheat Weedicides"],
        "rating": 4.8
    },
    # Larkana
    {
        "id": "ffc_larkana_services",
        "name": "Fauji Fertilizer Company (FFC) Farm Centre",
        "partner_brand": "FFC Sona",
        "district": "Larkana, Sindh",
        "address": "Station Road, Larkana",
        "phone": "+92 74 4045120",
        "whatsapp": "923025553456",
        "verified": True,
        "specialties": ["Sona Urea", "Sona DAP", "Zinc Sulphate", "Rice Protection"],
        "rating": 4.9
    },
    # Hyderabad & Lower Sindh
    {
        "id": "syngenta_hyderabad_depot",
        "name": "Syngenta Crop Protection Franchise",
        "partner_brand": "Syngenta Pakistan",
        "district": "Hyderabad, Sindh",
        "address": "Auto Bhan Road, Latifabad, Hyderabad",
        "phone": "+92 22 3819200",
        "whatsapp": "923035554567",
        "verified": True,
        "specialties": ["Score (Difenoconazole)", "Amistar Top", "Pest Scouting Kits"],
        "rating": 4.9
    },
    {
        "id": "kanzo_hyderabad_agri",
        "name": "Kanzo AG Certified Crop Clinic",
        "partner_brand": "Kanzo Group",
        "district": "Hyderabad, Sindh",
        "address": "Hala Naka, National Highway, Hyderabad",
        "phone": "+92 22 2654311",
        "whatsapp": "923045555678",
        "verified": True,
        "specialties": ["Bio-stimulants", "Potash", "Micronutrients", "Cotton Spray"],
        "rating": 4.7
    },
    # Multan & South Punjab
    {
        "id": "engro_multan_agri",
        "name": "Engro Farm Extension & Soil Clinic",
        "partner_brand": "Engro Fertilizers",
        "district": "Multan, Punjab",
        "address": "Vehari Road, Industrial Estate, Multan",
        "phone": "+92 61 6512390",
        "whatsapp": "923055556789",
        "verified": True,
        "specialties": ["Engro Zabardast Urea", "NPK Special", "Cotton Whitefly Control"],
        "rating": 5.0
    },
    {
        "id": "fmc_multan_depot",
        "name": "Ali Akbar Group & FMC Crop Care",
        "partner_brand": "FMC / Ali Akbar Group",
        "district": "Multan, Punjab",
        "address": "Khanewal Road, Multan",
        "phone": "+92 61 6789123",
        "whatsapp": "923065557890",
        "verified": True,
        "specialties": ["Wheat Rust Cure", "Pesticides", "Spray Machines"],
        "rating": 4.8
    },
    # Faisalabad
    {
        "id": "ffc_faisalabad_care",
        "name": "FFC Kisan Markaz Faisalabad",
        "partner_brand": "FFC Sona",
        "district": "Faisalabad, Punjab",
        "address": "Jhang Road, Near Agri University, Faisalabad",
        "phone": "+92 41 2541098",
        "whatsapp": "923075558901",
        "verified": True,
        "specialties": ["Soil Testing", "Fungicides", "Wheat Seed Treatment"],
        "rating": 4.9
    }
]

class DealerService:
    def get_dealers_for_district(self, district: Optional[str] = None) -> List[Dict[str, Any]]:
        if not district:
            return PAKISTAN_AGRI_DEALERS[:4]
        
        normalized = district.lower().split(",")[0].strip()
        matched = [
            d for d in PAKISTAN_AGRI_DEALERS
            if normalized in d["district"].lower()
        ]
        
        # If no exact match for district, return primary hubs (Sukkur, Hyderabad, Multan)
        if not matched:
            return PAKISTAN_AGRI_DEALERS[:4]
        return matched

dealer_service = DealerService()
