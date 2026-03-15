import os
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# -----------------------------
# Load trained model
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "model.pkl")
model = joblib.load(model_path)

# -----------------------------
# Feature order used in training
# -----------------------------
FEATURE_COLUMNS = [
    "gender",
    "age",
    "profession",
    "academic_pressure",
    "work_pressure",
    "cgpa",
    "study_satisfaction",
    "job_satisfaction",
    "dietary_habits",
    "degree",
    "have_you_ever_had_suicidal_thoughts_",
    "work_study_hours",
    "financial_stress",
    "family_history_of_mental_illness",
    "Sleep_'5-6 hours'",
    "Sleep_'7-8 hours'",
    "Sleep_'Less than 5 hours'",
    "Sleep_'More than 8 hours'",
    "Sleep_Others"
]

# -----------------------------
# Input schema
# -----------------------------
class SurveyInput(BaseModel):
    gender: int
    age: float
    profession: int
    academic_pressure: float
    work_pressure: float
    cgpa: float
    study_satisfaction: float
    job_satisfaction: float
    dietary_habits: int
    degree: int
    have_you_ever_had_suicidal_thoughts_: int
    work_study_hours: float
    financial_stress: float
    family_history_of_mental_illness: int

    Sleep_5_6: int
    Sleep_7_8: int
    Sleep_less_5: int
    Sleep_more_8: int
    Sleep_others: int

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
def home():
    return {"message": "Mental Health Prediction API running"}

# -----------------------------
# Prediction endpoint
# -----------------------------
@app.post("/predict")
def predict(data: SurveyInput):

    input_data = data.dict()

    formatted_input = {
        "gender": input_data["gender"],
        "age": input_data["age"],
        "profession": input_data["profession"],
        "academic_pressure": input_data["academic_pressure"],
        "work_pressure": input_data["work_pressure"],
        "cgpa": input_data["cgpa"],
        "study_satisfaction": input_data["study_satisfaction"],
        "job_satisfaction": input_data["job_satisfaction"],
        "dietary_habits": input_data["dietary_habits"],
        "degree": input_data["degree"],
        "have_you_ever_had_suicidal_thoughts_": input_data["have_you_ever_had_suicidal_thoughts_"],
        "work_study_hours": input_data["work_study_hours"],
        "financial_stress": input_data["financial_stress"],
        "family_history_of_mental_illness": input_data["family_history_of_mental_illness"],
        "Sleep_'5-6 hours'": input_data["Sleep_5_6"],
        "Sleep_'7-8 hours'": input_data["Sleep_7_8"],
        "Sleep_'Less than 5 hours'": input_data["Sleep_less_5"],
        "Sleep_'More than 8 hours'": input_data["Sleep_more_8"],
        "Sleep_Others": input_data["Sleep_others"]
    }

    df = pd.DataFrame([formatted_input])
    df = df[FEATURE_COLUMNS]

    prediction = model.predict(df)[0]

    return {
        "prediction": int(prediction),
        "meaning": "Depression Risk Detected" if prediction == 1 else "No Depression Risk"
    }