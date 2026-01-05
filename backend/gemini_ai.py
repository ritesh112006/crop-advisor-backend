"""Gemini AI Chatbot Integration"""
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyD9f-NRoQClx37UuwoYjMr7uVPDla0oJQs"

genai.configure(api_key=GEMINI_API_KEY)

def get_farming_advice(user_query, sensor_data=None, crop_type=None, weather_data=None):
    """Get farming advice from Gemini AI with comprehensive context"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Build comprehensive context from sensor and weather data
        context = "You are an expert agricultural advisor with deep knowledge of crop farming, soil management, and pest control."
        
        if crop_type:
            context += f"\n\nFarmer's Crop: {crop_type}"
        
        if sensor_data:
            context += f"""

Current Soil & Environmental Readings:
- Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
- Soil pH Level: {sensor_data.get('ph', 'N/A')} (Optimal: 6.0-7.5)
- Air Temperature: {sensor_data.get('temperature', 'N/A')}°C
- Air Humidity: {sensor_data.get('humidity', 'N/A')}%
- Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm
- Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm
- Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm"""
        
        if weather_data:
            context += f"""

External Weather Forecast:
{weather_data}"""
        
        prompt = f"""{context}

Based on the above information, answer this farmer's question with practical, actionable advice:

"{user_query}"

Please provide:
1. Direct answer to the specific question
2. Recommendations based on current sensor readings (if applicable)
3. Any immediate actions or warnings
4. Best practices for the current conditions"""
        
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text
        else:
            return "I received an empty response. Please try your question again."
    except Exception as e:
        print(f"❌ Error getting Gemini response: {e}")
        return f"Sorry, I encountered an error: {str(e)}. Please try again later."
    except Exception as e:
        print(f"❌ Error getting Gemini response: {e}")
        return "Sorry, I couldn't get advice at the moment. Please try again later."

def get_crop_health_recommendation(sensor_data, crop_type):
    """Get specific AI recommendations for improving crop health"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Analyze which parameters are out of range
        issues = []
        if sensor_data.get('moisture', 0) < 30 or sensor_data.get('moisture', 0) > 80:
            issues.append(f"Soil moisture is {sensor_data.get('moisture')}% (optimal: 40-60%)")
        if sensor_data.get('ph', 0) < 6.0 or sensor_data.get('ph', 0) > 7.5:
            issues.append(f"Soil pH is {sensor_data.get('ph')} (optimal: 6.0-7.5)")
        if sensor_data.get('nitrogen', 0) < 30:
            issues.append(f"Nitrogen level is low at {sensor_data.get('nitrogen')} ppm")
        if sensor_data.get('phosphorus', 0) < 20:
            issues.append(f"Phosphorus level is low at {sensor_data.get('phosphorus')} ppm")
        if sensor_data.get('potassium', 0) < 25:
            issues.append(f"Potassium level is low at {sensor_data.get('potassium')} ppm")
        if sensor_data.get('temperature', 0) > 35 or sensor_data.get('temperature', 0) < 10:
            issues.append(f"Temperature is extreme at {sensor_data.get('temperature')}°C")
        if sensor_data.get('humidity', 0) > 90 or sensor_data.get('humidity', 0) < 30:
            issues.append(f"Humidity is {sensor_data.get('humidity')}% (risk of fungal diseases if high)")
        
        issues_text = "\n".join([f"• {issue}" for issue in issues]) if issues else "All parameters are within normal ranges"
        
        prompt = f"""You are an expert agricultural consultant. Provide detailed recommendations to optimize crop health.

Crop Type: {crop_type}

Current Sensor Readings:
- Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
- pH Level: {sensor_data.get('ph', 'N/A')}
- Temperature: {sensor_data.get('temperature', 'N/A')}°C
- Humidity: {sensor_data.get('humidity', 'N/A')}%
- Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm
- Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm
- Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm

Issues Detected:
{issues_text}

Please provide a comprehensive health improvement plan with:
1. Priority ranking of issues
2. Specific treatment for each issue
3. Timeline for improvement
4. Products/methods to use
5. Expected outcomes"""
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error getting recommendations: {e}")
        return "Unable to generate recommendations at this time."
