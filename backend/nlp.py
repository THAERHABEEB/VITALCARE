import pandas as pd
import numpy as np
import os
import re
from thefuzz import fuzz, process

SLANG_DICT = {
    "tummy ache": "stomach pain",
    "puke": "vomiting",
    "puking": "vomiting",
    "throw up": "vomiting",
    "throwing up": "vomiting",
    "head hurts": "headache",
    "runny nose": "continuous sneezing",
    "fivver": "fever",
    "fivor": "fever",
    "shaking": "shivering",
    "can't breathe": "breathlessness",
    "poop blood": "bloody stool",
    "chest hurts": "chest pain"
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

class MedicalNLP:
    def __init__(self):
        try:
            self.disease_symptoms = pd.read_csv(os.path.join(DATA_DIR, 'DiseaseAndSymptoms.csv'))
            self.precautions = pd.read_csv(os.path.join(DATA_DIR, 'Disease precaution.csv'))
            self.medicines = pd.read_csv(os.path.join(DATA_DIR, 'Medicine_Details.csv'))
            
            symptom_cols = [col for col in self.disease_symptoms.columns if 'Symptom' in col]
            
            # Extract all unique symptoms and clean them
            all_symptoms = set()
            self.disease_profiles = {}
            
            for _, row in self.disease_symptoms.iterrows():
                disease = str(row['Disease']).strip()
                if disease not in self.disease_profiles:
                    self.disease_profiles[disease] = set()
                
                for col in symptom_cols:
                    val = str(row[col])
                    if val != 'nan' and val.strip():
                        symptom = val.replace('_', ' ').strip().lower()
                        self.disease_profiles[disease].add(symptom)
                        all_symptoms.add(symptom)
            
            self.all_symptoms = list(all_symptoms)
            self.ready = True
        except Exception as e:
            print(f"Error loading NLP data: {e}")
            self.ready = False

    def get_common_symptoms(self):
        # Return a list of recognizable symptoms for the frontend quick-select
        if not self.ready: return []
        # Return top 30 common symptoms roughly
        # Counting frequencies
        freq = {}
        for disease, syms in self.disease_profiles.items():
            for s in syms:
                freq[s] = freq.get(s, 0) + 1
        sorted_syms = sorted(freq.keys(), key=lambda x: freq[x], reverse=True)
        return [s.capitalize() for s in sorted_syms[:30]]

    def predict_disease(self, user_text: str, selected_symptoms: list = None):
        if not self.ready:
            return {"error": "NLP Engine not initialized"}
        
        user_text = user_text.lower()
        matched_symptoms = set()
        
        # 1. Add explicitly selected symptoms
        if selected_symptoms:
            for s in selected_symptoms:
                matched_symptoms.add(s.lower())
                
        # 2. Pre-process slang/synonyms
        for slang, medical_term in SLANG_DICT.items():
            if slang in user_text:
                matched_symptoms.add(medical_term)
                user_text = user_text.replace(slang, "") # remove to avoid double matching
                
        # 3. Extract symptoms from free text using fuzzy matching
        for symptom in self.all_symptoms:
            if len(symptom) > 4 and fuzz.partial_ratio(symptom, user_text) > 85:
                matched_symptoms.add(symptom)
                
        # Also do a reverse check: fuzzy word match to catch heavy typos (e.g. fivver -> fever)
        words = [w for w in re.findall(r'\b\w+\b', user_text) if len(w) > 3]
        if words:
            # We use extractBests to find the top matches in the entire symptom list for each word
            for word in words:
                matches = process.extractBests(word, self.all_symptoms, score_cutoff=70, limit=2)
                for match, score in matches:
                    # If it's a single word symptom, accept it more easily
                    if len(match.split()) == 1 or score > 85:
                        matched_symptoms.add(match)

        if not matched_symptoms:
            return {"error": "Could not identify specific medical symptoms from your input. Please try using the quick-select options or describe symptoms more clearly (e.g., 'headache', 'fever', 'nausea')."}

        # Scoring system: Jaccard-like similarity + count
        best_disease = None
        best_score = -1
        
        for disease, d_symptoms in self.disease_profiles.items():
            intersection = matched_symptoms.intersection(d_symptoms)
            if len(intersection) > 0:
                # Score = (number of matching symptoms) / (total symptoms for this disease)
                # We weight the raw count higher to prefer diseases that have many of the stated symptoms
                score = len(intersection) + (len(intersection) / len(d_symptoms))
                if score > best_score:
                    best_score = score
                    best_disease = disease
        
        if not best_disease:
            return {"error": "Could not confidently diagnose. Please provide more symptoms."}
            
        confidence = min(0.99, best_score / (len(matched_symptoms) + 1))
        
        # Get Precautions
        precaution_row = self.precautions[self.precautions['Disease'].str.strip() == best_disease]
        precautions = []
        if not precaution_row.empty:
            precautions = precaution_row.iloc[0, 1:5].dropna().tolist()
            
        # Get Medicines (Smarter keyword match in 'Uses')
        disease_lower = best_disease.lower()
        # Split disease into words and remove common stop words
        disease_words = [w for w in disease_lower.replace('-', ' ').split() if len(w) > 3 and w not in ['and', 'the', 'infection', 'disease', 'syndrome']]
        
        # If no words left (e.g. 'GERD'), just use the whole string
        if not disease_words:
            disease_words = [disease_lower]
            
        def match_med(uses_text):
            uses_text = str(uses_text).lower()
            for word in disease_words:
                if word in uses_text:
                    return True
            return False
            
        matched_meds = self.medicines[self.medicines['Uses'].apply(match_med)]
        
        # If still no matches, just pick some general ones or fallback based on symptom
        if matched_meds.empty and len(self.medicines) > 0:
             # fallback to first 2 medicines as a safe default for demo
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
            "confidence": float(confidence),
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
                "symptoms": list(syms)[:6],  # limit to 6 for UI
                "precautions": precautions
            })
        return diseases

# Singleton instance
nlp_engine = MedicalNLP()
