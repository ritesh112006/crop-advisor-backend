"""Maileroo Email API Integration"""
import requests
import os

MAILEROO_API_KEY = "fb0b21d25ce6babb9f7b1073f8c6eb0ecd6b94908ba2f835ad795e8a622a7388"
MAILEROO_API_URL = "https://api.maileroo.io/email/send"

def send_alert_email(recipient_email, subject, message, alert_type="info"):
    """Send alert email using Maileroo API"""
    try:
        payload = {
            "to": recipient_email,
            "subject": f"[{alert_type.upper()}] Crop Advisor Alert: {subject}",
            "html": f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #2c3e50;">Crop Advisor Alert</h2>
                        <p style="color: #34495e; font-size: 16px;">{message}</p>
                        <hr style="border: none; border-top: 1px solid #ecf0f1;">
                        <p style="color: #95a5a6; font-size: 12px;">
                            This is an automated alert from your Crop Advisor system.
                        </p>
                        <a href="https://crop-advisor-frontend-1.onrender.com" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a>
                    </div>
                </body>
            </html>
            """,
            "from": "noreply@cropadvisor.com",
            "api_key": MAILEROO_API_KEY
        }
        
        response = requests.post(MAILEROO_API_URL, json=payload)
        
        if response.status_code == 200:
            print(f"✅ Alert email sent to {recipient_email}")
            return True
        else:
            print(f"❌ Failed to send email: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False

def send_welcome_email(email, name):
    """Send welcome email to new users"""
    try:
        payload = {
            "to": email,
            "subject": "Welcome to Crop Advisor!",
            "html": f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #27ae60;">Welcome to Crop Advisor, {name}! 🌾</h1>
                        <p style="color: #34495e; font-size: 16px;">
                            You're now connected to our smart farming system. Your ESP32 sensor is ready to send real-time data.
                        </p>
                        <h3 style="color: #2c3e50;">What's Next:</h3>
                        <ul style="color: #34495e; font-size: 14px;">
                            <li>Set up your soil sensors (moisture, pH, NPK)</li>
                            <li>Connect your ESP32 to receive automated alerts</li>
                            <li>Monitor your crop health in real-time</li>
                        </ul>
                        <a href="https://crop-advisor-frontend-1.onrender.com" style="background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                    </div>
                </body>
            </html>
            """,
            "from": "noreply@cropadvisor.com",
            "api_key": MAILEROO_API_KEY
        }
        
        response = requests.post(MAILEROO_API_URL, json=payload)
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error sending welcome email: {e}")
        return False
