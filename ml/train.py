import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
processed_path = os.path.join(BASE_DIR, "../data/processed/data_cleaned.csv")
model_path = os.path.join(BASE_DIR, "model.pkl")

# Load cleaned dataset
if not os.path.exists(processed_path):
    raise FileNotFoundError(f"Cleaned dataset not found: {processed_path}")

df = pd.read_csv(processed_path)

# Features and target
X = df.drop("depression", axis=1)
y = df["depression"]

# Ensure all features are numeric
X = X.apply(pd.to_numeric, errors='coerce')
X.fillna(0, inplace=True)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save model
joblib.dump(model, model_path)
print(f"Trained model saved at {model_path}")