import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
raw_path = os.path.join(BASE_DIR, "../data/raw/data.csv")
processed_path = os.path.join(BASE_DIR, "../data/processed/data_cleaned.csv")

# Load dataset
if not os.path.exists(raw_path):
    raise FileNotFoundError(f"Dataset not found: {raw_path}")

df = pd.read_csv(raw_path)

df.columns = df.columns.str.replace(' ', '_').str.replace('/', '_').str.replace('?', '').str.lower()
#print(df.columns)
df = df.drop(columns=["id", "city"], errors='ignore')
df["gender"] = df["gender"].map({"Male": 0, "Female": 1})
df["profession"] = df["profession"].map({
'Student': 0,
'Civil Engineer': 1,
'Architect': 2,
'UX/UI Designer': 3,
'Digital Marketer': 4,
'Content Writer': 5,
'Educational Consultant': 6,
'Teacher': 7,
'Manager': 8,
'Chef': 9,
'Doctor': 10,
'Lawyer': 11,
'Entrepreneur': 12,
'Pharmacist': 13
})
df = pd.get_dummies(df, columns=["sleep_duration"], prefix="Sleep", drop_first=False)
df["dietary_habits"] = df["dietary_habits"].map({
    'Healthy' : 0,
    'Moderate' : 1,
    'Unhealthy' : 2,
    'Others' : 3
})
df["degree"] = df["degree"].map({
'B.Pharm' : 0, 'BSc' : 1, 'BA' : 2, 'BCA' : 3, 'M.Tech' : 4, 'PhD' : 5, "'Class 12'" : 6, 'B.Ed' : 7, 'LLB' : 8, 'BE' : 9,
 'M.Ed' : 10, 'MSc' : 11, 'BHM' : 12, 'M.Pharm' : 13, 'MCA' : 14, 'MA' : 15, 'B.Com' : 16, 'MD' : 17, 'MBA' : 18, 'MBBS' : 19, 'M.Com' : 20,
 'B.Arch' : 21, 'LLM' : 22, 'B.Tech' : 23, 'BBA' : 24, 'ME' : 25, 'MHM' : 26, 'Others' : 27
})
df["have_you_ever_had_suicidal_thoughts_"] = df["have_you_ever_had_suicidal_thoughts_"].map({"Yes": 1, "No": 0})    
df["family_history_of_mental_illness"] = df["family_history_of_mental_illness"].map({"Yes": 1, "No": 0})
df["financial_stress"] = pd.to_numeric(df["financial_stress"], errors='coerce')
df = df.dropna(subset=["financial_stress"])

print(df.columns)


# Save cleaned dataset
os.makedirs(os.path.dirname(processed_path), exist_ok=True)
df.to_csv(processed_path, index=False)
print(f"Preprocessing complete. Cleaned dataset saved to '{processed_path}'")