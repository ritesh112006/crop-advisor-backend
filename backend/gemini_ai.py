"""
Gemini AI Chatbot Integration - Personalized with Google Generative AI
Uses google-generativeai for dynamic and personalized responses
"""
import google.generativeai as genai
from typing import Optional, Dict, Any

# Initialize with Gemini API key
GEMINI_API_KEY = "AIzaSyCmSEPEIdtKgzBDB2tWKcsGLREbmijoEGo"

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def create_gemini_model(model_name: str = "gemini-2.5-flash"):
    """Create and return a Gemini model instance"""
    return genai.GenerativeModel(model_name)

def get_farming_advice(user_query: str, sensor_data: Optional[Dict[str, Any]] = None, 
                      crop_type: Optional[str] = None, weather_data: Optional[Dict[str, Any]] = None,
                      user_location: Optional[str] = None, user_name: Optional[str] = None, 
                      language: str = "en") -> str:
    """
    Get personalized farming advice from Gemini AI based on user context, 
    sensor data, weather, and crop type.
    Supports multiple languages.
    """
    try:
        model = create_gemini_model()
        
        # Language instructions
        lang_instructions = {
            "en": "Respond in English.",
            "hi": "हिंदी में जवाब दें। Use Hindi language.",
            "mr": "मराठीतून जवाब द्या। Use Marathi language.",
            "ta": "தமிழ் மொழியில் பதிலளிக்கவும். Use Tamil language.",
            "te": "తెలుగు భాషలో సమాధానం ఇవ్వండి. Use Telugu language.",
            "kn": "ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ಕೊಡಿ. Use Kannada language.",
            "ml": "മലയാളം ഭാഷയിൽ ഉത്തരം നൽകുക. Use Malayalam language.",
        }
        
        lang_instruction = lang_instructions.get(language, lang_instructions["en"])
        
        # Build personalized context
        context_parts = []
        
        if user_name:
            context_parts.append(f"Farmer's Name: {user_name}")
        
        if user_location:
            context_parts.append(f"Location: {user_location}")
        
        if crop_type:
            context_parts.append(f"Growing Crop: {crop_type}")
        
        # Add sensor data context
        if sensor_data:
            sensor_context = "\nCurrent Farm Sensor Data:"
            sensor_context += f"\n• Soil Moisture: {sensor_data.get('moisture', 'N/A')}%"
            sensor_context += f"\n• pH Level: {sensor_data.get('ph', 'N/A')}"
            sensor_context += f"\n• Temperature: {sensor_data.get('temperature', 'N/A')}°C"
            sensor_context += f"\n• Humidity: {sensor_data.get('humidity', 'N/A')}%"
            sensor_context += f"\n• Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm"
            sensor_context += f"\n• Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm"
            sensor_context += f"\n• Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm"
            context_parts.append(sensor_context)
        
        # Add weather context if available
        if weather_data and isinstance(weather_data, dict):
            try:
                if weather_data.get("list") and len(weather_data["list"]) > 0:
                    current_weather = weather_data["list"][0]
                    weather_context = "\nCurrent Weather Conditions:"
                    weather_context += f"\n• Temperature: {current_weather.get('main', {}).get('temp', 'N/A')}°C"
                    weather_context += f"\n• Humidity: {current_weather.get('main', {}).get('humidity', 'N/A')}%"
                    weather_context += f"\n• Condition: {current_weather.get('weather', [{}])[0].get('description', 'N/A')}"
                    weather_context += f"\n• Wind Speed: {current_weather.get('wind', {}).get('speed', 'N/A')} m/s"
                    weather_context += f"\n• Rainfall: {current_weather.get('rain', {}).get('3h', 0)} mm"
                    context_parts.append(weather_context)
            except Exception as e:
                print(f"⚠️ Could not parse weather data: {e}")
        
        context = "\n".join(context_parts)
        
        # Create the system instruction for personalized responses
        system_instruction = """You are an expert and compassionate agricultural advisor specializing in personalized crop guidance.

Your role:
1. Provide specific, actionable advice tailored to the farmer's location, crop type, and current conditions
2. Use the provided sensor data and weather information to give precise recommendations
3. Consider the farmer's current situation and provide practical solutions
4. Be encouraging and supportive while giving honest assessments
5. Provide step-by-step guidance when needed
6. Include estimated timelines for actions
7. Suggest both conventional and organic methods when applicable

Communication style:
- Be conversational and friendly (like talking to a trusted local agricultural expert)
- Use emojis to make responses more engaging
- Organize information clearly with bullet points or numbered lists
- Provide reasoning for your recommendations
- Always explain the "why" behind your advice
- Offer preventive tips alongside immediate solutions

When responding:
- Address the farmer by name if provided
- Reference their specific crop and local conditions
- Use their current sensor readings to back up recommendations
- Consider seasonal factors and upcoming weather
- Prioritize urgent actions over general tips"""
        
        prompt = f"""{context}

Farmer's Question: {user_query}

{lang_instruction}

Please provide comprehensive, personalized, actionable advice that directly addresses their situation based on their sensor data, location, and crop type. Be specific, detailed and practical. Ensure the response is complete and not truncated."""
        
        # Call Gemini API with personalization
        model = create_gemini_model()
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=4096,
                top_p=0.95,
                top_k=40,
            )
        )
        
        result = response.text if hasattr(response, 'text') else str(response)
        print(f"[OK] Successfully got Gemini response (length: {len(result)} chars)")
        return result
        
    except Exception as e:
        print(f"[ERROR] Error getting Gemini response: {e}")
        import traceback
        traceback.print_exc()
        return f"I apologize, but I encountered a technical issue while processing your question: {str(e)}. Please try again in a moment."

def get_crop_health_recommendation(sensor_data: Optional[Dict[str, Any]] = None, 
                                  crop_type: Optional[str] = None,
                                  user_name: Optional[str] = None,
                                  user_location: Optional[str] = None,
                                  language: str = "en") -> str:
    """
    Get personalized crop health recommendations based on current sensor readings.
    Supports multiple languages.
    """
    try:
        model = create_gemini_model()
        
        if not sensor_data or not crop_type:
            return "I need both sensor data and crop type information to provide health recommendations."
        
        # Language instructions
        lang_instructions = {
            "en": "Respond in English.",
            "hi": "हिंदी में जवाब दें। Use Hindi language.",
            "mr": "मराठीतून जवाब द्या। Use Marathi language.",
            "ta": "தமிழ் மொழியில் பதிலளிக்கவும். Use Tamil language.",
            "te": "తెలుగు భాషలో సమాధానం ఇవ్వండి. Use Telugu language.",
            "kn": "ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ಕೊಡಿ. Use Kannada language.",
            "ml": "മലയാളം ഭാഷയിൽ ഉത്തരം നൽകുക. Use Malayalam language.",
        }
        
        lang_instruction = lang_instructions.get(language, lang_instructions["en"])
        
        # Build context
        context = f"Crop Type: {crop_type}\n"
        if user_name:
            context += f"Farmer: {user_name}\n"
        if user_location:
            context += f"Location: {user_location}\n"
        
        context += f"""
Sensor Readings:
- Soil Moisture: {sensor_data.get('moisture', 'N/A')}%
- pH Level: {sensor_data.get('ph', 'N/A')}
- Temperature: {sensor_data.get('temperature', 'N/A')}°C
- Humidity: {sensor_data.get('humidity', 'N/A')}%
- Nitrogen (N): {sensor_data.get('nitrogen', 'N/A')} ppm
- Phosphorus (P): {sensor_data.get('phosphorus', 'N/A')} ppm
- Potassium (K): {sensor_data.get('potassium', 'N/A')} ppm"""
        
        system_instruction = f"""You are an agricultural health specialist. Analyze the provided sensor data and give comprehensive, specific recommendations to optimize crop health. 
        
Include:
1. Overall crop health assessment
2. Specific issues identified (if any)
3. Priority actions (most urgent first)
4. Timeline for implementation
5. Expected improvements from recommended actions
6. Preventive measures for future issues

{lang_instruction}

Be practical, specific, detailed and encouraging. Provide a COMPLETE response without truncation."""
        
        prompt = f"{context}\n\n{system_instruction}"
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.6,
                max_output_tokens=4096,
                top_p=0.95,
                top_k=40,
            )
        )
        
        result = response.text if hasattr(response, 'text') else str(response)
        print(f"[OK] Successfully got crop health recommendation (length: {len(result)} chars)")
        return result
        
    except Exception as e:
        print(f"[ERROR] Error getting recommendations: {e}")
        import traceback
        traceback.print_exc()
        return f"I couldn't generate health recommendations at this moment. Please try again later. Error: {str(e)}"

def analyze_crop_image(image_data: str, crop_type: Optional[str] = None, user_name: Optional[str] = None, language: str = "en") -> str:
    """
    Analyze a crop image and provide insights using Gemini's vision capabilities.
    
    Args:
        image_data: Base64 encoded image data or image path
        crop_type: Type of crop in the image
        user_name: Name of the farmer for personalization
        language: Language code (en, hi, mr, ta, te, kn, ml)
    """
    try:
        model = create_gemini_model()
        
        lang_instructions = {
            "en": "Respond in English.",
            "hi": "हिंदी में जवाब दें। Use Hindi language.",
            "mr": "मराठीतून जवाब द्या। Use Marathi language.",
            "ta": "தமிழ் மொழியில் பதிலளிக்கவும். Use Tamil language.",
            "te": "తెలుగు భాషలో సమాధానం ఇవ్వండి. Use Telugu language.",
            "kn": "ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ ಉತ್ತರ ಕೊಡಿ. Use Kannada language.",
            "ml": "മലയാളം ഭാഷയിൽ ഉത്തരം നൽകുക. Use Malayalam language.",
        }
        lang_instruction = lang_instructions.get(language, lang_instructions["en"])
        
        context = ""
        if user_name:
            context += f"Farmer: {user_name}\n"
        if crop_type:
            context += f"Crop Type: {crop_type}\n"
        
        system_instruction = f"""You are an expert agricultural image analyst. When analyzing crop images:

1. Identify the crop health status visually
2. Look for signs of diseases, pests, or nutrient deficiencies
3. Assess leaf color, texture, and overall plant vigor
4. Note any visible damage or stress indicators
5. Provide specific recommendations based on observed issues
6. Suggest next steps for improvement

{lang_instruction}

Be detailed but clear, using specific agricultural terminology. Provide a COMPLETE response without truncation."""
        
        prompt = f"""{context}

Please analyze this crop image and provide:
1. Visual health assessment
2. Any visible issues or concerns (diseases, pests, deficiencies)
3. Recommendations for care
4. Estimated severity of any issues
5. Next steps to take"""
        
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=4096,
                top_p=0.95,
                top_k=40,
            )
        )
        
        result = response.text if hasattr(response, 'text') else str(response)
        print(f"[OK] Successfully analyzed crop image (length: {len(result)} chars)")
        return result
        
    except Exception as e:
        print(f"[ERROR] Error analyzing image: {e}")
        import traceback
        traceback.print_exc()
        return f"I couldn't analyze the image at this time. Please ensure it's a valid crop image and try again. Error: {str(e)}"
