import numpy as np
import pandas as pd
import os

def generate_dataset(num_samples=2500, output_path="crowd_data.csv"):
    np.random.seed(42)

    # 1. Generate Capacity
    capacity = np.random.randint(10000, 100000, size=num_samples)
    
    # 2. Generate Crowd Count (mostly centered around capacity with some variance, occasionally exceeding it)
    crowd_ratio = np.random.uniform(0.1, 1.25, size=num_samples)
    crowd_count = (capacity * crowd_ratio).astype(int)
    
    # 3. Generate Inflow and Outflow rates (people per min)
    entry_rate = np.random.randint(10, 1000, size=num_samples)
    exit_rate = np.random.randint(10, 1000, size=num_samples)
    
    # 4. Temperature and Weather
    temperature = np.random.randint(10, 50, size=num_samples)
    weather = np.random.choice(["Sunny", "Rainy", "Stormy"], size=num_samples, p=[0.6, 0.25, 0.15])
    
    # 5. Security personnel and exits
    security_staff = np.random.randint(20, 500, size=num_samples)
    emergency_exits = np.random.randint(2, 16, size=num_samples)

    data = pd.DataFrame({
        "crowdCount": crowd_count,
        "capacity": capacity,
        "temperature": temperature,
        "weather": weather,
        "entryRate": entry_rate,
        "exitRate": exit_rate,
        "securityStaff": security_staff,
        "emergencyExits": emergency_exits
    })

    # 6. Apply scoring logic to determine risk label
    risk_labels = []
    
    for idx, row in data.iterrows():
        occupancy_ratio = row["crowdCount"] / row["capacity"]
        rate_multiplier = (row["entryRate"] - row["exitRate"]) / 60
        staff_ratio = row["crowdCount"] / row["securityStaff"] if row["securityStaff"] > 0 else 500
        
        score = 0
        
        # Occupancy contribution
        if occupancy_ratio > 1.0:
            score += 45
        elif occupancy_ratio > 0.85:
            score += 30
        elif occupancy_ratio > 0.7:
            score += 15
            
        # Flow rate contribution
        if rate_multiplier > 4.5:
            score += 35
        elif rate_multiplier > 2.0:
            score += 20
            
        # Weather
        if row["weather"] == "Stormy":
            score += 25
        elif row["weather"] == "Rainy":
            score += 15
            
        # Temperature
        if row["temperature"] > 38:
            score += 10
            
        # Security coverage
        if staff_ratio > 200:
            score += 20
        elif staff_ratio > 150:
            score += 10
            
        # Exits availability
        if row["emergencyExits"] < 4:
            score += 20
        elif row["emergencyExits"] < 6:
            score += 10
            
        # Add random noise
        score += np.random.normal(0, 4)
        
        # Categorize
        if score >= 60 or occupancy_ratio > 0.95 or rate_multiplier > 4.5:
            risk_labels.append("High")
        elif score >= 30 or occupancy_ratio > 0.75:
            risk_labels.append("Medium")
        else:
            risk_labels.append("Low")
            
    data["risk"] = risk_labels
    
    data.to_csv(output_path, index=False)
    print(f"SUCCESS: Generated {num_samples} samples and saved to {output_path}")
    print(data["risk"].value_counts())

if __name__ == "__main__":
    generate_dataset()
