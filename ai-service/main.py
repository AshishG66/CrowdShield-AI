import pickle
import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="CrowdShield AI - Prediction Service")

# Allow CORS for internal backend service communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = None

@app.on_event("startup")
def load_model():
    global model
    if not os.path.exists(MODEL_PATH):
        raise RuntimeError(f"Model file {MODEL_PATH} not found. Please train the model first.")
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print("SUCCESS: Loaded Random Forest pipeline model from model.pkl")

class PredictionInput(BaseModel):
    crowdCount: int
    capacity: int
    temperature: float
    weather: str
    entryRate: int
    exitRate: int
    securityStaff: int
    emergencyExits: int
    eventId: Optional[str] = None
    timestamp: Optional[str] = None
    humidity: Optional[float] = None

@app.post("/predict")
def predict_risk(input_item: PredictionInput):
    global model
    if model is None:
        # Fallback load attempt
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as f:
                model = pickle.load(f)
        else:
            raise HTTPException(status_code=500, detail="Prediction model is not initialized.")

    # 1. Weather Cleaning/Mapping
    weather_clean = input_item.weather.strip()
    if weather_clean not in ["Sunny", "Rainy", "Stormy", "Cloudy"]:
        if weather_clean == "Clear":
            weather_clean = "Sunny"
        else:
            weather_clean = "Sunny"  # Default fallback

    # 2. Extract Day (Weekday/Weekend) and Time (Morning/Afternoon/Evening/Night) from timestamp
    day_val = "Weekday"
    time_val = "Evening"
    if input_item.timestamp:
        try:
            dt = pd.to_datetime(input_item.timestamp)
            day_val = "Weekend" if dt.weekday() >= 5 else "Weekday"
            hour = dt.hour
            if 6 <= hour < 12:
                time_val = "Morning"
            elif 12 <= hour < 17:
                time_val = "Afternoon"
            elif 17 <= hour < 21:
                time_val = "Evening"
            else:
                time_val = "Night"
        except Exception:
            pass

    # 3. Calculate derived features
    occupancy_rate = (input_item.crowdCount / input_item.capacity) * 100.0
    crowd_density = (input_item.crowdCount / input_item.capacity) * 6.0  # Heuristic estimation of density bounds
    medical_staff = int(round(input_item.securityStaff * 0.36))
    humidity_val = input_item.humidity if input_item.humidity is not None else 50.0
    event_type = "Concert"  # Default fallback event type with negligible feature importance

    # 4. Form input DataFrame in the exact column order matching training set
    input_data = pd.DataFrame([{
        "Event_Type": event_type,
        "Crowd_Count": input_item.crowdCount,
        "Venue_Capacity": input_item.capacity,
        "Occupancy_Rate": occupancy_rate,
        "Entry_Rate": input_item.entryRate,
        "Exit_Rate": input_item.exitRate,
        "Temperature": input_item.temperature,
        "Humidity": humidity_val,
        "Weather": weather_clean,
        "Day": day_val,
        "Time": time_val,
        "Security_Staff": input_item.securityStaff,
        "Medical_Staff": medical_staff,
        "Emergency_Exits": input_item.emergencyExits,
        "Crowd_Density": crowd_density
    }])

    try:
        # 5. Predict risk class and probability confidence
        risk_class = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        
        classes = list(model.classes_)
        class_idx = classes.index(risk_class)
        confidence_pct = float(probabilities[class_idx] * 100)

        # 6. Generate context-aware recommendations based on metric ratios
        recommendations = []
        occupancy_ratio = input_item.crowdCount / input_item.capacity
        rate_multiplier = (input_item.entryRate - input_item.exitRate) / 60
        staff_ratio = input_item.crowdCount / input_item.securityStaff if input_item.securityStaff > 0 else 500

        if risk_class in ["High", "Critical"]:
            recommendations.append("Open emergency exits immediately")
            if staff_ratio > 180:
                recommendations.append("Deploy additional volunteer security marshal units")
            if rate_multiplier > 4.0:
                recommendations.append("De-escalate bottleneck by reducing entry rate gates")
            if occupancy_ratio > 1.0:
                recommendations.append("Diverting incoming crowd flow to alternate venue zones")
            if len(recommendations) < 3:
                recommendations.append("Alert medical backup stations")
        elif risk_class == "Medium":
            recommendations.append("Open auxiliary flow corridors")
            if staff_ratio > 150:
                recommendations.append("Deploy 8 volunteers to exit gate quadrants")
            if rate_multiplier > 2.0:
                recommendations.append("Monitor entry point queues closely")
            if len(recommendations) < 2:
                recommendations.append("Prepare crowd diversion procedures")
        else:
            recommendations.append("Normal density bounds maintained")
            recommendations.append("Continue camera telemetry logs scans")

        return {
            "risk": risk_class,
            "confidence": round(confidence_pct, 1),
            "recommendation": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

