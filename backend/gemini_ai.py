"""Gemini AI Chatbot Integration"""
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyD9f-NRoQClx37UuwoYjMr7uVPDla0oJQs"

genai.configure(api_key=GEMINI_API_KEY)

def get_farming_advice(user_query, sensor_data=None, crop_type=None, weather_data=None):
    """Get farming advice from Gemini AI"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # Build context from sensor data
        context = ""
        if sensor_data:
            context = f"""
            Current Sensor Data:
            - Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
            - pH Level: {sensor_data.get('ph', 'N/A')}
            - Temperature: {sensor_data.get('temperature', 'N/A')}°C
            - Humidity: {sensor_data.get('humidity', 'N/A')}%
            - Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm
            - Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm
            - Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm
            """
        
        if crop_type:
            context += f"\nCrop Type: {crop_type}"
        
        prompt = f"""You are an expert agricultural advisor. Provide practical, actionable farming advice.
        
        {context}
        
        Farmer's Question: {user_query}
        
        Please provide:
        1. Direct answer to the question
        2. Relevant recommendations based on sensor data (if provided)
        3. Any immediate actions needed
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error getting Gemini response: {e}")
        return "Sorry, I couldn't get advice at the moment. Please try again later."

def get_crop_health_recommendation(sensor_data, crop_type):
    """Get specific recommendations for improving crop health"""
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = f"""You are an expert agricultural advisor. Based on these sensor readings and crop type, provide specific recommendations to improve crop health.
        
        Sensor Data:
        - Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
        - pH Level: {sensor_data.get('ph', 'N/A')}
        - Temperature: {sensor_data.get('temperature', 'N/A')}°C
        - Humidity: {sensor_data.get('humidity', 'N/A')}%
        - Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm
        - Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm
        - Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm
        
        Crop Type: {crop_type}
        
        Please provide:
        1. Assessment of current health
        2. Priority issues to address
        3. Specific action items with timeline
        """
        
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"❌ Error getting recommendations: {e}")
        return "Unable to generate recommendations at this time."

        return "Unable to generate recommendations at this time."
