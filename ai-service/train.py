import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support

def train_model(data_path="dataset/CrowdShield_AI_Dataset_20000.xlsx", model_output_path="model.pkl"):
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Please run generate_data.py first or ensure the dataset is moved.")

    # 1. Load dataset
    df = pd.read_excel(data_path)
    print(f"Loaded dataset from {data_path} ({df.shape[0]} rows)")

    # 2. Separate features (X) and target (y)
    # We drop Event_ID and Risk_Level (the target)
    X = df.drop(columns=["Event_ID", "Risk_Level"])
    y = df["Risk_Level"]

    # 3. Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Define features for preprocessing
    categorical_features = ["Event_Type", "Weather", "Day", "Time"]
    numerical_features = [
        "Crowd_Count", "Venue_Capacity", "Occupancy_Rate", "Entry_Rate", 
        "Exit_Rate", "Temperature", "Humidity", "Security_Staff", 
        "Medical_Staff", "Emergency_Exits", "Crowd_Density"
    ]

    # 5. Create preprocessor pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numerical_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )

    # 6. Create Gradient Boosting Classifier pipeline
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", GradientBoostingClassifier(n_estimators=100, random_state=42))
    ])

    # 7. Train model
    print("Training Gradient Boosting Classifier...")
    pipeline.fit(X_train, y_train)

    # 8. Evaluate model
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    
    print("\n--- Model Evaluation ---")
    print(f"Accuracy : {accuracy * 100:.1f}%")
    print(f"Precision : {precision * 100:.1f}%")
    print(f"Recall : {recall * 100:.1f}%")
    print(f"F1 Score : {f1 * 100:.1f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # 9. Save model pipeline
    with open(model_output_path, "wb") as f:
        pickle.dump(pipeline, f)
    
    print(f"SUCCESS: Trained model saved successfully to {model_output_path}")

if __name__ == "__main__":
    train_model()

