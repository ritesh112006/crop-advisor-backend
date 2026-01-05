"""Alert generation logic based on sensor data"""
from db import create_alert

def check_sensor_health(user_id, sensor_data):
    """Generate alerts based on sensor readings"""
    alerts = []
    
    moisture = sensor_data.get("moisture", 0)
    ph = sensor_data.get("ph", 0)
    nitrogen = sensor_data.get("nitrogen", 0)
    phosphorus = sensor_data.get("phosphorus", 0)
    potassium = sensor_data.get("potassium", 0)
    temperature = sensor_data.get("temperature", 0)
    humidity = sensor_data.get("humidity", 0)
    
    # Moisture checks
    if moisture < 30:
        message = f"⚠️ Soil moisture is low ({moisture}%). Your crops need watering soon."
        create_alert(user_id, "watering", message, "warning")
        alerts.append(message)
    elif moisture > 80:
        message = f"⚠️ Soil moisture is too high ({moisture}%). Check for drainage issues."
        create_alert(user_id, "watering", message, "warning")
        alerts.append(message)
    
    # pH checks
    if ph < 5.5:
        message = f"⚠️ Soil pH is too acidic ({ph}). Add lime to increase pH."
        create_alert(user_id, "fertilizing", message, "warning")
        alerts.append(message)
    elif ph > 8.0:
        message = f"⚠️ Soil pH is too alkaline ({ph}). Add sulfur to decrease pH."
        create_alert(user_id, "fertilizing", message, "warning")
        alerts.append(message)
    
    # NPK checks
    if nitrogen < 30:
        message = "⚠️ Nitrogen levels are low. Apply nitrogen fertilizer."
        create_alert(user_id, "fertilizing", message, "warning")
        alerts.append(message)
    
    if phosphorus < 20:
        message = "⚠️ Phosphorus levels are low. Apply phosphate fertilizer."
        create_alert(user_id, "fertilizing", message, "warning")
        alerts.append(message)
    
    if potassium < 25:
        message = "⚠️ Potassium levels are low. Apply potassium fertilizer."
        create_alert(user_id, "fertilizing", message, "warning")
        alerts.append(message)
    
    # Temperature checks
    if temperature > 35:
        message = f"⚠️ Temperature is too high ({temperature}°C). Ensure proper irrigation."
        create_alert(user_id, "temperature", message, "warning")
        alerts.append(message)
    elif temperature < 10:
        message = f"⚠️ Temperature is too low ({temperature}°C). Frost risk detected."
        create_alert(user_id, "temperature", message, "warning")
        alerts.append(message)
    
    # Humidity checks
    if humidity > 90:
        message = f"⚠️ Humidity is very high ({humidity}%). Risk of fungal diseases."
        create_alert(user_id, "disease", message, "warning")
        alerts.append(message)
    elif humidity < 30:
        message = f"⚠️ Humidity is too low ({humidity}%). Increase irrigation frequency."
        create_alert(user_id, "humidity", message, "warning")
        alerts.append(message)
    
    return alerts

def calculate_crop_health(sensor_data):
    """Calculate crop health status based on sensor data"""
    score = 0
    total_checks = 0
    
    # Moisture: optimal 40-60%
    moisture = sensor_data.get("moisture", 0)
    if 40 <= moisture <= 60:
        score += 1
    total_checks += 1
    
    # pH: optimal 6.0-7.5
    ph = sensor_data.get("ph", 0)
    if 6.0 <= ph <= 7.5:
        score += 1
    total_checks += 1
    
    # NPK: check if all are at least 30+
    if sensor_data.get("nitrogen", 0) >= 30:
        score += 1
    if sensor_data.get("phosphorus", 0) >= 20:
        score += 1
    if sensor_data.get("potassium", 0) >= 25:
        score += 1
    total_checks += 3
    
    # Temperature: optimal 20-30°C
    temperature = sensor_data.get("temperature", 0)
    if 20 <= temperature <= 30:
        score += 1
    total_checks += 1
    
    # Humidity: optimal 50-80%
    humidity = sensor_data.get("humidity", 0)
    if 50 <= humidity <= 80:
        score += 1
    total_checks += 1
    
    # Calculate percentage
    health_percent = (score / total_checks) * 100
    
    if health_percent >= 75:
        return "Good"
    elif health_percent >= 50:
        return "Average"
    else:
        return "Bad"
