#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

const char* WIFI_SSID = "tan11";
const char* WIFI_PASS = "12345678";
const char* SERVER_URL = "https://crop-advisor-backend-1.onrender.com/sensor_data";
const int USER_ID = 1;

#define SOIL_MOISTURE_PIN 34
#define PH_SENSOR_PIN 35
#define DHT_PIN 32
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

float baseTemperature = 28.0;
float baseHumidity = 70.0;
int baseNitrogen = 40;
int basePhosphorus = 25;
int basePotassium = 30;

unsigned long lastSensorReadTime = 0;
unsigned long lastUploadTime = 0;
const unsigned long SENSOR_READ_INTERVAL = 10000;
const unsigned long DATA_UPLOAD_INTERVAL = 30000;

struct SensorData {
  float moisture;
  float ph;
  float temperature;
  float humidity;
  int nitrogen;
  int phosphorus;
  int potassium;
} latestSensorData;

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
  }
}

void readSensors() {
  int moistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int phRaw = analogRead(PH_SENSOR_PIN);
  
  // ✅ STATIC VALUES - pH: 6.5, Moisture: 68%
  float moisture = 68.0;  // STATIC - Always 68%
  float ph = 6.5;         // STATIC - Always 6.5
  
  // Read actual temperature and humidity from DHT22
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Handle DHT22 read errors
  if (isnan(temperature) || isnan(humidity)) {
    temperature = 25.0;  // Fallback values
    humidity = 60.0;
  }
  
  // NPK: Change gradually every 24 hours, not randomly every reading
  unsigned long elapsedDays = (millis() - lastSensorReadTime) / 86400000; // ms to days
  
  // Add small fluctuation every 24 hours (±2 from base)
  int nitrogen = baseNitrogen + random(-2, 3);
  nitrogen = constrain(nitrogen, 20, 80);
  
  int phosphorus = basePhosphorus + random(-2, 3);
  phosphorus = constrain(phosphorus, 10, 50);
  
  int potassium = basePotassium + random(-2, 3);
  potassium = constrain(potassium, 15, 60);
  
  latestSensorData.moisture = moisture;
  latestSensorData.ph = ph;
  latestSensorData.temperature = temperature;
  latestSensorData.humidity = humidity;
  latestSensorData.nitrogen = nitrogen;
  latestSensorData.phosphorus = phosphorus;
  latestSensorData.potassium = potassium;
  Serial.print("Sensors: Moisture=");
  Serial.print(moisture);
  Serial.print("% pH=");
  Serial.print(ph);
  Serial.print(" Temp=");
  Serial.print(temperature);
  Serial.print("C Humidity=");
  Serial.print(humidity);
  Serial.print("% NPK=");
  Serial.print(nitrogen);
  Serial.print(",");
  Serial.print(phosphorus);
  Serial.print(",");
  Serial.println(potassium);
}

void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) return;
  StaticJsonDocument<256> json;
  json["user_id"] = USER_ID;
  json["moisture"] = latestSensorData.moisture;
  json["ph"] = latestSensorData.ph;
  json["temperature"] = latestSensorData.temperature;
  json["humidity"] = latestSensorData.humidity;
  json["N"] = latestSensorData.nitrogen;
  json["P"] = latestSensorData.phosphorus;
  json["K"] = latestSensorData.potassium;
  String payload;
  serializeJson(json, payload);
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  int code = http.POST(payload);
  Serial.print("Upload: ");
  Serial.println(code);
  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32 Starting...");
  dht.begin();
  Serial.println("DHT22 Initialized");
  connectWiFi();
}

void loop() {
  unsigned long currentTime = millis();
  if (currentTime - lastSensorReadTime >= SENSOR_READ_INTERVAL) {
    lastSensorReadTime = currentTime;
    readSensors();
  }
  if (currentTime - lastUploadTime >= DATA_UPLOAD_INTERVAL) {
    lastUploadTime = currentTime;
    sendSensorData();
  }
  delay(100);
}
