#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

/* ---------------- WIFI DETAILS ---------------- */
const char* WIFI_SSID = "tan11";
const char* WIFI_PASS = "12345678";

/* ------------- BACKEND URL ------------------- */
const char* SERVER_URL = "https://crop-advisor-backend-1.onrender.com/sensor_data";

/* ----------- USER ID (Get from Dashboard after login) ----------- */
const int USER_ID = 1;  // CHANGE THIS to your user_id from dashboard
#define SOIL_MOISTURE_PIN 34   // Analog
#define PH_SENSOR_PIN     35   // Analog

/* ----------- DUMMY VALUES (Until Real Sensors) ----------- */
// If you already have DHT11/DHT22/NPK,
// replace these with real readings

float temperature = 28.0;
float humidity    = 70.0;
int nitrogen      = 40;
int phosphorus    = 25;
int potassium     = 30;

/* --------- TIMING VARIABLES (ms) ----------- */
unsigned long lastSensorReadTime = 0;      // Last sensor read time
unsigned long lastUploadTime = 0;          // Last data upload time
const unsigned long SENSOR_READ_INTERVAL = 10000;   // Read sensors every 10 seconds
const unsigned long DATA_UPLOAD_INTERVAL = 30000;   // Upload to server every 30 seconds

/* --------- LATEST SENSOR VALUES ---------- */
struct SensorData {
  float moisture;
  float ph;
  float temperature;
  float humidity;
  int nitrogen;
  int phosphorus;
  int potassium;
} latestSensorData;

/* -------------------------------------------------------- */

void connectWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("🔌 Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi Connected");
  Serial.print("📡 IP Address: ");
  Serial.println(WiFi.localIP());
}

void sendSensorData() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi not connected");
    return;
  }

  /* JSON Payload with latest sensor data */
  StaticJsonDocument<256> json;
  json["user_id"]     = USER_ID;
  json["moisture"]    = latestSensorData.moisture;
  json["ph"]          = latestSensorData.ph;
  json["temperature"] = latestSensorData.temperature;
  json["humidity"]    = latestSensorData.humidity;
  json["N"]           = latestSensorData.nitrogen;
  json["P"]           = latestSensorData.phosphorus;
  json["K"]           = latestSensorData.potassium;

  String payload;
  serializeJson(json, payload);

  Serial.println("\n📤 Uploading Data to Dashboard:");
  Serial.println(payload);

  /* HTTP POST */
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("✅ Upload Successful - Server Response: ");
    Serial.println(response);
  } else {
    Serial.print("❌ Upload Failed - Error Code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

void readSensors() {
  /* Read Sensors every 10 seconds */
  
  int moistureRaw = analogRead(SOIL_MOISTURE_PIN);
  int phRaw       = analogRead(PH_SENSOR_PIN);

  /* Improved Moisture Calculation */
  // Calibration values - adjust based on your sensor
  int dryValue = 4095;    // Sensor reading when completely dry
  int wetValue = 1000;    // Sensor reading when completely wet
  
  // Map analog value (0-4095) to moisture percentage (0-100%)
  float moisture = map(moistureRaw, dryValue, wetValue, 0, 100);
  // Constrain to 0-100% range
  moisture = constrain(moisture, 0, 100);
  
  /* pH Calculation */
  // Formula: pH = 3.5 + (1.0 * ADC/4095 * 4)
  float ph = 3.5 + (phRaw / 4095.0) * 4.0;
  ph = constrain(ph, 3.0, 9.0);

  /* Store in latest sensor data */
  latestSensorData.moisture = moisture;
  latestSensorData.ph = ph;
  latestSensorData.temperature = temperature;  // Can be from DHT22
  latestSensorData.humidity = humidity;        // Can be from DHT22
  latestSensorData.nitrogen = nitrogen;
  latestSensorData.phosphorus = phosphorus;
  latestSensorData.potassium = potassium;

  Serial.println("\n📊 Sensors Read (every 10s):");
  Serial.print("  Moisture: ");
  Serial.print(moisture);
  Serial.println("%");
  Serial.print("  pH: ");
  Serial.println(ph);
  Serial.print("  Temperature: ");
  Serial.println(temperature);
  Serial.print("  Humidity: ");
  Serial.println(humidity);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  connectWiFi();
}

void loop() {
  unsigned long currentTime = millis();

  /* Read sensors every 10 seconds */
  if (currentTime - lastSensorReadTime >= SENSOR_READ_INTERVAL) {
    lastSensorReadTime = currentTime;
    readSensors();
  }

  /* Upload to server every 30 seconds */
  if (currentTime - lastUploadTime >= DATA_UPLOAD_INTERVAL) {
    lastUploadTime = currentTime;
    sendSensorData();
  }

  /* Small delay to prevent CPU overload */
  delay(100);
}
