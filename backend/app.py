from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import bcrypt
from pydantic import BaseModel
import database
import nlp

app = FastAPI(title="Healthcare NLP Diagnosis API")

# Setup CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Using bcrypt directly

# Pydantic Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class DiagnosisRequest(BaseModel):
    symptoms: str
    selected_symptoms: list = []

@app.get("/api/symptoms")
def get_symptoms():
    return nlp.nlp_engine.get_common_symptoms()

@app.get("/api/diseases")
def get_diseases():
    return nlp.nlp_engine.get_all_diseases()

@app.post("/api/register")
def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), salt).decode('utf-8')
    new_user = database.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": {"name": new_user.name, "email": new_user.email}}

@app.post("/api/login")
def login_user(user: UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.email == user.email).first()
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": "Login successful", "user": {"name": db_user.name, "email": db_user.email}}

@app.post("/api/diagnose")
def diagnose(request: DiagnosisRequest):
    if request.symptoms.strip() == "" and len(request.selected_symptoms) == 0:
        raise HTTPException(status_code=400, detail="BACKEND_ERR: Please describe your symptoms or select from the quick-list.")
    
    result = nlp.nlp_engine.predict_disease(request.symptoms, request.selected_symptoms)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
        
    return result

@app.get("/api/articles")
def get_articles():
    return nlp.nlp_engine.get_articles(limit=20)

@app.get("/api/dashboard")
def get_dashboard_stats():
    # Simple mock stats for the dashboard
    return {
        "total_patients_analyzed": 1420,
        "certified_specialists": 204,
        "patient_experience": "98%",
        "upcoming_appointments": 3
    }
