import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SelectedCrop {
  id: number;
  name: string;
  matchScore: number;
  yieldRange: string;
  sowingTime: string;
  harvestTime: string;
  waterNeeds: "Low" | "Medium" | "High";
  fertilizerTips: string;
  imageEmoji: string;
}

// Mock sensor data that would come from backend
export interface SensorData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  temperature: number;
  humidity: number;
  ph: number;
  timestamp: Date;
}

// Mock weather data
export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
}

interface CropContextType {
  selectedCrop: SelectedCrop | null;
  setSelectedCrop: (crop: SelectedCrop | null) => void;
  sensorData: SensorData;
  weatherData: WeatherData;
}

// Simulated real-time sensor data
const mockSensorData: SensorData = {
  nitrogen: 65,
  phosphorus: 45,
  potassium: 80,
  moisture: 55,
  temperature: 28,
  humidity: 65,
  ph: 6.5,
  timestamp: new Date(),
};

// Simulated weather data
const mockWeatherData: WeatherData = {
  temperature: 32,
  humidity: 68,
  rainfall: 15,
  forecast: "Partly cloudy with chance of rain",
  condition: "cloudy",
};

const CropContext = createContext<CropContextType | undefined>(undefined);

export const CropProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCrop, setSelectedCrop] = useState<SelectedCrop | null>(() => {
    const saved = localStorage.getItem("selected-crop");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSetSelectedCrop = (crop: SelectedCrop | null) => {
    setSelectedCrop(crop);
    if (crop) {
      localStorage.setItem("selected-crop", JSON.stringify(crop));
    } else {
      localStorage.removeItem("selected-crop");
    }
  };

  return (
    <CropContext.Provider 
      value={{ 
        selectedCrop, 
        setSelectedCrop: handleSetSelectedCrop,
        sensorData: mockSensorData,
        weatherData: mockWeatherData,
      }}
    >
      {children}
    </CropContext.Provider>
  );
};

export const useCrop = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error("useCrop must be used within a CropProvider");
  }
  return context;
};
