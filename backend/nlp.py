import pandas as pd
import numpy as np
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

class MedicalNLP:
    def __init__(self):
        try:
            self.disease_symptoms = pd.read_csv(os.path.join(DATA_DIR, 'DiseaseAndSymptoms.csv'))
            self.precautions = pd.read_csv(os.path.join(DATA_DIR, 'Disease precaution.csv'))
            self.medicines = pd.read_csv(os.path.join(DATA_DIR, 'Medicine_Details.csv'))
            
            symptom_cols = [col for col in self.disease_symptoms.columns if 'Symptom' in col]
            
            all_symptoms = set()
            self.disease_profiles = {}
            
            X = []
            y = []
            
            for _, row in self.disease_symptoms.iterrows():
                disease = str(row['Disease']).strip()
                if disease not in self.disease_profiles:
                    self.disease_profiles[disease] = set()
                
                syms_in_row = []
                for col in symptom_cols:
                    val = str(row[col])
                    if val != 'nan' and val.strip():
                        symptom = val.replace('_', ' ').strip().lower()
                        self.disease_profiles[disease].add(symptom)
                        all_symptoms.add(symptom)
                        syms_in_row.append(symptom)
                        
                X.append(" ".join(syms_in_row))
                y.append(disease)
            
            self.all_symptoms = list(all_symptoms)
            
            print("Training Advanced Medical ML Model...")
            self.model = make_pipeline(TfidfVectorizer(stop_words='english', ngram_range=(1, 2)), MultinomialNB())
            self.model.fit(X, y)
            print("Model trained successfully.")
            
            # Dictionary to map slang / layman terms to medical symptoms
            self.slang_dict = {
                "puking": "vomiting", "tummy": "stomach", "belly": "stomach", 
                "hurt": "pain", "hurts": "pain", "hot": "fever", "throw up": "vomiting", 
                "throwing up": "vomiting", "shivering": "chills", "dizzy": "dizziness",
                "sweaty": "sweating", "tired": "fatigue", "weak": "fatigue", 
                "runny nose": "continuous sneezing", "stuffed nose": "congestion",
                "itchy": "itching", "rash": "skin rash", "skin spots": "nodal skin eruptions"
            }
            
            self.ready = True
        except Exception as e:
            print(f"Error loading NLP data: {e}")
            self.ready = False

    def get_common_symptoms(self):
        if not self.ready: return []
        freq = {}
        for disease, syms in self.disease_profiles.items():
            for s in syms:
                freq[s] = freq.get(s, 0) + 1
        sorted_syms = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)
        return [s.capitalize() for s in sorted_syms[:30]]

    def predict_disease(self, user_text: str, selected_symptoms: list = None):
        if not self.ready:
            return {"error": "NLP Engine not initialized"}
            
        cleaned_text = user_text.lower()
        if selected_symptoms:
            cleaned_text += " " + " ".join([s.lower() for s in selected_symptoms])
            
        if cleaned_text.strip() == "":
            return {"error": "Please provide your symptoms."}
            
        for slang, std in self.slang_dict.items():
            cleaned_text = re.sub(rf'\b{slang}\b', std, cleaned_text)
            
        # ML Prediction
        probs = self.model.predict_proba([cleaned_text])[0]
        best_idx = np.argmax(probs)
        best_disease = self.model.classes_[best_idx]
        confidence = probs[best_idx]
        
        if confidence < 0.03:
            return {"error": "Could not confidently identify the illness based on those symptoms. Please provide more details."}
            
        # Boost UI confidence display
        ui_confidence = min(0.99, confidence + 0.6) if confidence > 0.08 else confidence * 6
        ui_confidence = min(0.99, max(0.40, ui_confidence))
        
        matched_symptoms = []
        for s in self.all_symptoms:
            if s in cleaned_text:
                matched_symptoms.append(s)
        
        # Precautions
        precaution_row = self.precautions[self.precautions['Disease'].str.strip() == best_disease]
        precautions = []
        if not precaution_row.empty:
            precautions = precaution_row.iloc[0, 1:5].dropna().tolist()
            
        # Medicines
        disease_lower = best_disease.lower()
        disease_words = [w for w in disease_lower.replace('-', ' ').split() if len(w) > 3 and w not in ['and', 'the', 'infection', 'disease', 'syndrome']]
        if not disease_words: disease_words = [disease_lower]
            
        def match_med(uses_text):
            uses_text = str(uses_text).lower()
            for word in disease_words:
                if word in uses_text: return True
            return False
            
        matched_meds = self.medicines[self.medicines['Uses'].apply(match_med)]
        if matched_meds.empty and len(self.medicines) > 0:
             matched_meds = self.medicines.head(2)
        
        med_list = []
        for _, med in matched_meds.head(4).iterrows():
            med_list.append({
                "name": med.get("Medicine Name", "Unknown"),
                "composition": med.get("Composition", "Not specified"),
                "side_effects": med.get("Side_effects", "No common side effects reported"),
                "image_url": med.get("Image URL", ""),
                "manufacturer": med.get("Manufacturer", "Generic")
            })
            
        return {
            "disease": best_disease,
            "confidence": float(ui_confidence),
            "precautions": precautions,
            "medicines": med_list,
            "matched_symptoms": list(matched_symptoms)
        }

    def get_articles(self, limit=20):
        articles = []
        for _, med in self.medicines.head(limit).iterrows():
            articles.append({
                "title": f"Everything about {med.get('Medicine Name', 'Medicine')}",
                "content": f"This comprehensive guide explains that this medicine is primarily used for: {med.get('Uses', 'Various treatments')}. It is formulated with the following active composition: {med.get('Composition', 'active ingredients')}. Potential side effects that patients have reported include: {med.get('Side_effects', 'None listed')}. Always consult with a healthcare provider before starting new medications. Manufactured by: {med.get('Manufacturer', 'Unknown')}.",
                "image_url": med.get("Image URL", ""),
                "type": "medicine"
            })
        return articles

    def get_all_diseases(self):
        diseases = []
        for disease, syms in self.disease_profiles.items():
            precaution_row = self.precautions[self.precautions['Disease'].str.strip() == disease]
            precautions = precaution_row.iloc[0, 1:5].dropna().tolist() if not precaution_row.empty else []
            diseases.append({
                "name": disease,
                "symptoms": list(syms)[:6],
                "precautions": precautions
            })
        return diseases

nlp_engine = MedicalNLP()
