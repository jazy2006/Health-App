import sys
import json

def get_best_doctor(disease):
    disease = disease.lower()
    
    # Mock database of doctors and their mapping to diseases based on popularity
    knowledge_base = {
        'heart': {'doctor': 'Dr. Sarah Jenkins', 'spec': 'Cardiologist', 'hospital': 'Metro City Hospital'},
        'cardio': {'doctor': 'Dr. Sarah Jenkins', 'spec': 'Cardiologist', 'hospital': 'Metro City Hospital'},
        'fever': {'doctor': 'Dr. Michael Chen', 'spec': 'General Physician', 'hospital': 'Wellness Clinic'},
        'cold': {'doctor': 'Dr. Michael Chen', 'spec': 'General Physician', 'hospital': 'Wellness Clinic'},
        'stress': {'doctor': 'Dr. Emily Garcia', 'spec': 'Psychiatrist', 'hospital': 'Serenity Mental Health'},
        'anxiety': {'doctor': 'Dr. Emily Garcia', 'spec': 'Psychiatrist', 'hospital': 'Serenity Mental Health'},
        'depression': {'doctor': 'Dr. Emily Garcia', 'spec': 'Psychiatrist', 'hospital': 'Serenity Mental Health'},
    }

    # very simple keyword matching for the AI
    best_match = None
    for keyword, doc in knowledge_base.items():
        if keyword in disease:
            best_match = doc
            break
            
    if best_match:
        result = {
            "success": True,
            "message": f"Super AI suggests {best_match['doctor']} who is highly popular for {disease}.",
            "doctor": best_match
        }
    else:
        result = {
            "success": False,
            "message": "Super AI could not find a hyper-specific match. We recommend a general physician like Dr. Michael Chen.",
            "doctor": {'doctor': 'Dr. Michael Chen', 'spec': 'General Physician', 'hospital': 'Wellness Clinic'}
        }
        
    print(json.dumps(result))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = sys.argv[1]
        get_best_doctor(query)
    else:
        print(json.dumps({"success": False, "message": "No query provided"}))
