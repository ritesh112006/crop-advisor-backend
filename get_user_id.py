"""
Quick script to get your User ID from Crop Advisor
"""

import requests
import json

print("\n" + "="*50)
print("  CROP ADVISOR - GET YOUR USER ID")
print("="*50 + "\n")

# Option 1: Login to get user ID
email = input("📧 Enter your email: ").strip()
password = input("🔐 Enter your password: ").strip()

if not email or not password:
    print("❌ Email and password are required!")
    exit(1)

# Backend URL
BACKEND_URL = "https://crop-advisor-backend-1.onrender.com"

print("\n🔍 Logging in...")

try:
    response = requests.post(
        f"{BACKEND_URL}/auth/login",
        json={
            "email": email,
            "password": password
        },
        timeout=10
    )
    
    if response.status_code == 200:
        data = response.json()
        user_id = data.get("user_id")
        full_name = data.get("full_name", "User")
        token = data.get("token", "")
        
        print("\n✅ Login Successful!")
        print("\n" + "="*50)
        print(f"  👤 Name: {full_name}")
        print(f"  🆔 USER ID: {user_id}")
        print("="*50)
        
        print(f"\n📌 Use this in your ESP32 code:")
        print(f"   const int USER_ID = {user_id};")
        
        print(f"\n🔑 Your JWT Token (for API requests):")
        print(f"   {token}")
        
    else:
        error = response.json().get("error", "Unknown error")
        print(f"\n❌ Login failed: {error}")
        print(f"Status code: {response.status_code}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("Make sure the backend is running at:")
    print(f"   {BACKEND_URL}")
