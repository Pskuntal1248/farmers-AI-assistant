import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types for user preferences
interface UserPreferences {
  latitude: number | null;
  longitude: number | null;
  language: string;
}

// Helper function to get user preferences from localStorage
const getUserPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem('kisaan-mitra-preferences');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        latitude: parsed.latitude || null,
        longitude: parsed.longitude || null,
        language: parsed.language || 'en',
      };
    }
  } catch (error) {
    console.error('Error parsing user preferences:', error);
  }
  
  return {
    latitude: 28.7, // Default to Delhi coordinates
    longitude: 77.1,
    language: 'en',
  };
};

// Page-specific interfaces that map directly to API response fields

// Overview page specific data
interface OverviewData {
  district?: string;
  state?: string;
  currentSeason?: string;
  season?: string; // Fallback for currentSeason
  groundwaterIndex?: number;
  groundwater?: number; // Fallback for groundwaterIndex
  temperature?: number;
  temp?: number; // Fallback for temperature
  humidity?: number;
  weatherAlert?: string;
  weather_alert?: string; // Fallback for weatherAlert
  soilHealthInfo?: string;
  soil_health?: string; // Fallback for soilHealthInfo
  soilInfo?: string; // Alternative for soilHealthInfo
}

interface WeatherData {
  // Direct fields from API
  temperature?: number;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  realFeel?: number;
  windGust?: number;
  pressure?: number;
  visibility?: number;
  uvIndex?: number;
  sevenDayForecast?: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitationSum: number;
    windMax: number;
    uvMax: number;
  }>;
  averageTemperature?: number; // For climate data
  annualRainfall?: number; // For climate data
  koppenGeigerClassification?: string; // For climate data
  
  // Processed structure for component use
  current: {
    temperature: number;
    humidity: number;
    windSpeed?: number;
    realFeel?: number;
    windGust?: number;
    pressure?: number;
    visibility?: number;
    uvIndex?: number;
  };
  sevenDayForecast?: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitationSum: number;
    windMax: number;
    uvMax: number;
  }>;
  climateData?: {
    averageTemperature: number;
    annualRainfall: number;
    koppenGeigerClassification: string;
  };
}

interface SoilData {
  // Core soil properties (required)
  ph: number;
  topsoilMoisture: number;
  subsoilMoisture: number;
  soilType: string;
  soilTemperature: number;
  
  // Soil composition and structure
  soilOrganicCarbon: number;
  cationExchangeCapacity: number;
  bulkDensity: number;
  sandPercent: number;
  siltPercent: number;
  clayPercent: number;
  
  // Nutrient levels (N-P-K)
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  
  // Soil chemistry
  electricalConductivity: number;
  salinity: number;
  
  // Health score (optional, calculated)
  soilHealthScore?: number;
}

interface CropData {
  // Direct fields from API
  recommendationText?: string;
  currentSeason?: string;
  season?: string; // Fallback for currentSeason
  cropProfiles?: Array<{
    name: string;
    season: string;
    soil: string;
    duration: string;
    ph: string;
    water: string;
    notes: string;
  }>;
  
  // Processed structure for component use
  recommendationText?: string;
  currentSeason?: string;
  profiles?: Array<{
    name: string;
    season: string;
    soil: string;
    duration: string;
    ph: string;
    water: string;
    notes: string;
  }>;
}

interface AnalyticsData {
  // Direct fields from API
  soilHealthTrend?: Array<{
    month: string;
    health: number;
    ph: number;
    moisture: number;
  }>;
  weatherTrends?: Array<{
    month: string;
    avgTemp: number;
    rainfall: number;
    humidity: number;
  }>;
  cropYields?: Array<{
    crop: string;
    yield: number;
    target: number;
  }>;
  monthlyMetrics?: Array<{
    month: string;
    irrigation: number;
    fertilizer: number;
    pesticide: number;
  }>;
  
  // Analytics page uses the same structure directly
}

// The actual API response structure based on the real response
interface ApiData {
  // Top-level dashboard data containing all nested information
  dashboardData?: {
    district?: string;
    state?: string;
    currentSeason?: string;
    groundwaterIndex?: number;
    
    // Nested soil data
    soilData?: {
      ph?: number;
      soilOrganicCarbon?: number;
      topsoilMoisture?: number;
      subsoilMoisture?: number;
      soilType?: string;
      cationExchangeCapacity?: number;
      bulkDensity?: number;
      nitrogen?: number;
      phosphorus?: number;
      potassium?: number;
      electricalConductivity?: number;
      salinity?: number;
      sandPercent?: number;
      siltPercent?: number;
      clayPercent?: number;
      soilTemperature?: number;
    };
    
    // Nested weather data
    weatherData?: {
      current?: {
        temperature?: number;
        humidity?: number;
        windSpeed?: number;
        realFeel?: number;
        windGust?: number;
        pressure?: number;
        visibility?: number;
        uvIndex?: number;
      };
      sevenDayForecast?: Array<{
        date: string;
        maxTemp: number;
        minTemp: number;
        precipitationSum: number;
        windMax: number;
        uvMax: number;
      }>;
    };
    
    // Climate data
    climateData?: {
      averageTemperature?: number;
      annualRainfall?: number;
      koppenGeigerClassification?: string;
      hottestMonthAvgMax?: number;
      coldestMonthAvgMin?: number;
      driestMonthRain?: number;
    };
  };
  
  // Crop recommendation data
  cropRecommendation?: {
    recommendationText?: string;
  };
  
  // Crop profiles array
  cropProfiles?: Array<{
    name: string;
    season: string;
    soil: string;
    duration: string;
    ph: string;
    water: string;
    notes: string;
  }>;
  
  // Pesticide profiles array
  pesticideProfiles?: Array<{
    name: string;
    targetPest: string;
    crop: string;
    modeOfAction: string;
    toxicity: string;
    preHarvestInterval: string;
    notes: string;
  }>;
  
  // Legacy fallback fields (for backward compatibility)
  district?: string;
  state?: string;
  currentSeason?: string;
  season?: string;
  groundwaterIndex?: number;
  groundwater?: number;
  temperature?: number;
  temp?: number;
  humidity?: number;
  weatherAlert?: string;
  weather_alert?: string;
  soilHealthInfo?: string;
  soil_health?: string;
  soilInfo?: string;
  ph?: number;
  recommendationText?: string;
  
  // Analytics data (if provided separately)
  analyticsData?: AnalyticsData;
  soilHealthTrend?: AnalyticsData['soilHealthTrend'];
  weatherTrends?: AnalyticsData['weatherTrends'];
  cropYields?: AnalyticsData['cropYields'];
  monthlyMetrics?: AnalyticsData['monthlyMetrics'];
  
  // Catch-all for any other fields that might be present
  [key: string]: any;
}

interface DataContextType {
  apiData: ApiData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  
  // Page-specific data getters that map API fields to appropriate structures
  getOverviewData: () => OverviewData;
  getWeatherData: () => WeatherData;
  getSoilData: () => SoilData;
  getCropData: () => CropData;
  getAnalyticsData: () => AnalyticsData;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debug logger for API data mapping
  const logFieldMapping = (pageName: string, fields: Record<string, any>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`${pageName} data mapping:`, fields);
    }
  };

  // Fetches all data from the API endpoint
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get user preferences for location and language
      const userPrefs = getUserPreferences();
      
      // Construct API URL with user preferences
      const apiUrl = `http://localhost:8080/api/all-data?lat=${userPrefs.latitude}&lon=${userPrefs.longitude}&lang=${userPrefs.language}`;
      
      console.log('Fetching data with user preferences:', {
        latitude: userPrefs.latitude,
        longitude: userPrefs.longitude,
        language: userPrefs.language,
        url: apiUrl
      });
      
      const response = await axios.get(apiUrl);
      const data = response.data;
      console.log('Fetched API data:', data);
      setApiData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Using fallback data.");
      // Set minimal fallback data so app doesn't break
      setApiData({});
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Listen for preference changes and refetch data
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kisaan-mitra-preferences') {
        console.log('User preferences changed, refetching data...');
        fetchData();
      }
    };

    // Listen for storage changes (when preferences are updated)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Get data specifically for the Overview page
  const getOverviewData = (): OverviewData => {
    const dashboard = apiData?.dashboardData;
    
    // Map Overview-specific fields from the actual API structure
    const overviewData: OverviewData = {
      district: dashboard?.district ?? apiData?.district,
      state: dashboard?.state ?? apiData?.state,
      currentSeason: dashboard?.currentSeason ?? apiData?.currentSeason ?? apiData?.season,
      groundwaterIndex: dashboard?.groundwaterIndex ?? apiData?.groundwaterIndex ?? apiData?.groundwater,
      temperature: dashboard?.weatherData?.current?.temperature ?? apiData?.temperature ?? apiData?.temp,
      humidity: dashboard?.weatherData?.current?.humidity ?? apiData?.humidity,
      weatherAlert: apiData?.weatherAlert ?? apiData?.weather_alert,
      soilHealthInfo: apiData?.soilHealthInfo ?? apiData?.soil_health ?? apiData?.soilInfo
    };
    
    logFieldMapping('Overview', overviewData);
    return overviewData;
  };
  
  // Get data specifically for the Weather page
  const getWeatherData = (): WeatherData => {
    const dashboard = apiData?.dashboardData;
    const weather = dashboard?.weatherData;
    const climate = dashboard?.climateData;
    
    // Map Weather-specific fields from the actual API structure
    const weatherData: WeatherData = {
      // Processed structure for components
      current: {
        temperature: weather?.current?.temperature ?? apiData?.temperature ?? apiData?.temp ?? 24.5,
        humidity: weather?.current?.humidity ?? apiData?.humidity ?? 65.0,
        windSpeed: weather?.current?.windSpeed ?? apiData?.windSpeed ?? 10.2,
        realFeel: weather?.current?.realFeel ?? apiData?.realFeel ?? 25.0,
        windGust: weather?.current?.windGust ?? apiData?.windGust ?? 0.0,
        pressure: weather?.current?.pressure ?? apiData?.pressure ?? 1013.2,
        visibility: weather?.current?.visibility ?? apiData?.visibility ?? 15.0,
        uvIndex: weather?.current?.uvIndex ?? apiData?.uvIndex ?? 3.0
      },
      // Use the API's sevenDayForecast from the nested structure
      sevenDayForecast: weather?.sevenDayForecast ?? apiData?.sevenDayForecast ?? [
        {
          date: "2025-09-24",
          maxTemp: 28.0,
          minTemp: 18.0,
          precipitationSum: 0.0,
          windMax: 12.0,
          uvMax: 5.0
        },
        {
          date: "2025-09-25", 
          maxTemp: 28.5,
          minTemp: 18.5,
          precipitationSum: 0.0,
          windMax: 10.0,
          uvMax: 4.0
        },
        {
          date: "2025-09-26",
          maxTemp: 29.0,
          minTemp: 19.0,
          precipitationSum: 5.0,
          windMax: 15.0,
          uvMax: 3.0
        },
        {
          date: "2025-09-27",
          maxTemp: 29.5,
          minTemp: 19.5,
          precipitationSum: 0.0,
          windMax: 8.0,
          uvMax: 6.0
        },
        {
          date: "2025-09-28",
          maxTemp: 30.0,
          minTemp: 20.0,
          precipitationSum: 0.0,
          windMax: 11.0,
          uvMax: 5.0
        },
        {
          date: "2025-09-29",
          maxTemp: 30.5,
          minTemp: 20.5,
          precipitationSum: 2.0,
          windMax: 13.0,
          uvMax: 4.0
        },
        {
          date: "2025-09-30",
          maxTemp: 31.0,
          minTemp: 21.0,
          precipitationSum: 0.0,
          windMax: 9.0,
          uvMax: 7.0
        }
      ],
      // Climate data section from the nested structure
      climateData: {
        averageTemperature: climate?.averageTemperature ?? apiData?.averageTemperature ?? 25.5,
        annualRainfall: climate?.annualRainfall ?? apiData?.annualRainfall ?? 1200.0,
        koppenGeigerClassification: climate?.koppenGeigerClassification ?? apiData?.koppenGeigerClassification ?? "उष्णकटिबंधीय सवाना"
      }
    };
    
    logFieldMapping('Weather', {
      temperature: weatherData.current.temperature,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      pressure: weatherData.current.pressure,
      visibility: weatherData.current.visibility,
      uvIndex: weatherData.current.uvIndex,
      forecastDays: weatherData.sevenDayForecast?.length,
      climateData: weatherData.climateData
    });
    
    return weatherData;
  };

  const getSoilData = (): SoilData => {
    const dashboard = apiData?.dashboardData;
    const soil = dashboard?.soilData;
    
    // Map Soil-specific fields using the exact values provided
    const soilData: SoilData = {
      // Core soil properties
      ph: soil?.ph ?? apiData?.ph ?? 7.2,
      topsoilMoisture: soil?.topsoilMoisture ?? apiData?.topsoilMoisture ?? 0,
      subsoilMoisture: soil?.subsoilMoisture ?? apiData?.subsoilMoisture ?? 0,
      soilType: soil?.soilType ?? apiData?.soilType?.toString() ?? "Clay Loam",
      soilTemperature: soil?.soilTemperature ?? apiData?.soilTemperature ?? 38.2,
      
      // Soil composition and structure
      soilOrganicCarbon: soil?.soilOrganicCarbon ?? apiData?.soilOrganicCarbon ?? 8.5,
      cationExchangeCapacity: soil?.cationExchangeCapacity ?? apiData?.cationExchangeCapacity ?? 12.2,
      bulkDensity: soil?.bulkDensity ?? apiData?.bulkDensity ?? 1.4,
      sandPercent: soil?.sandPercent ?? apiData?.sandPercent ?? 30,
      siltPercent: soil?.siltPercent ?? apiData?.siltPercent ?? 40,
      clayPercent: soil?.clayPercent ?? apiData?.clayPercent ?? 30,
      
      // Nutrient levels (N-P-K)
      nitrogen: soil?.nitrogen ?? apiData?.nitrogen ?? 25,
      phosphorus: soil?.phosphorus ?? apiData?.phosphorus ?? 30,
      potassium: soil?.potassium ?? apiData?.potassium ?? 180,
      
      // Soil chemistry
      electricalConductivity: soil?.electricalConductivity ?? apiData?.electricalConductivity ?? 0.8,
      salinity: soil?.salinity ?? apiData?.salinity ?? 2.1,
      
      // Health score (optional, calculated)
      soilHealthScore: soil?.soilHealthScore ?? apiData?.soilHealthScore ?? 78
    };
    
    logFieldMapping('Soil', {
      ph: soilData.ph,
      organicCarbon: soilData.soilOrganicCarbon,
      topsoilMoisture: soilData.topsoilMoisture,
      subsoilMoisture: soilData.subsoilMoisture,
      soilType: soilData.soilType,
      healthScore: soilData.soilHealthScore,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      soilTemperature: soilData.soilTemperature
    });
    
    return soilData;
  };

  const getCropData = (): CropData => {
    const dashboard = apiData?.dashboardData;
    
    // Map Crop-specific fields from the actual API structure
    const cropData: CropData = {
      // Get recommendation text from the cropRecommendation object
      recommendationText: apiData?.cropRecommendation?.recommendationText ?? 
                         apiData?.recommendationText ?? 
                         apiData?.cropData?.recommendationText ?? 
                         "Based on current soil and weather conditions, consider suitable crops for your region.",
      
      // Get current season with fallbacks
      currentSeason: dashboard?.currentSeason ?? 
                    apiData?.currentSeason ?? 
                    apiData?.season ?? 
                    apiData?.cropData?.currentSeason ?? 
                    "Current Season",
      
      // Get crop profiles directly from the top level (they're now at the root of the response)
      profiles: apiData?.cropProfiles ?? apiData?.cropData?.profiles ?? [
        {
          name: "Rice",
          season: "Kharif",
          soil: "Clayey to loamy, good water retention",
          duration: "110-140 days",
          ph: "5.5 - 7.0",
          water: "High",
          notes: "Requires puddled fields and warm temperatures."
        },
        {
          name: "Wheat",
          season: "Rabi",
          soil: "Well-drained loam to clay loam",
          duration: "120-150 days",
          ph: "6.0 - 7.5",
          water: "Moderate",
          notes: "India's main cereal crop."
        }
      ]
    };
    
    logFieldMapping('Crops', {
      recommendationText: cropData.recommendationText?.substring(0, 50) + '...',
      currentSeason: cropData.currentSeason,
      profileCount: cropData.profiles?.length,
      firstCrop: cropData.profiles?.[0]?.name
    });
    
    return cropData;
  };

  const getAnalyticsData = (): AnalyticsData => {
    // Map Analytics-specific fields from the API response
    const analyticsData: AnalyticsData = {
      // Get soil health trend data with fallback
      soilHealthTrend: apiData?.soilHealthTrend ?? apiData?.analyticsData?.soilHealthTrend ?? [
        { month: "Jan", health: 72, ph: 6.5, moisture: 18 },
        { month: "Feb", health: 74, ph: 6.6, moisture: 19 },
        { month: "Mar", health: 76, ph: 6.7, moisture: 21 },
        { month: "Apr", health: 75, ph: 6.8, moisture: 23 },
        { month: "May", health: 78, ph: 6.8, moisture: 22 },
        { month: "Jun", health: 77, ph: 6.9, moisture: 24 },
      ],
      // Get weather trends data with fallback
      weatherTrends: apiData?.weatherTrends ?? apiData?.analyticsData?.weatherTrends ?? [
        { month: "Jan", avgTemp: 18, rainfall: 45, humidity: 58 },
        { month: "Feb", avgTemp: 22, rainfall: 32, humidity: 62 },
        { month: "Mar", avgTemp: 25, rainfall: 28, humidity: 65 },
        { month: "Apr", avgTemp: 28, rainfall: 15, humidity: 58 },
        { month: "May", avgTemp: 32, rainfall: 22, humidity: 55 },
        { month: "Jun", rainfall: 85, avgTemp: 29, humidity: 72 },
      ],
      // Get crop yields data with fallback
      cropYields: apiData?.cropYields ?? apiData?.analyticsData?.cropYields ?? [
        { crop: "Wheat", yield: 3200, target: 3500 },
        { crop: "Rice", yield: 4100, target: 4000 },
        { crop: "Cotton", yield: 1800, target: 2000 },
        { crop: "Soybean", yield: 1950, target: 2100 },
        { crop: "Corn", yield: 2800, target: 2600 },
      ],
      // Get monthly metrics data with fallback
      monthlyMetrics: apiData?.monthlyMetrics ?? apiData?.analyticsData?.monthlyMetrics ?? [
        { month: "Jan", irrigation: 120, fertilizer: 45, pesticide: 8 },
        { month: "Feb", irrigation: 140, fertilizer: 52, pesticide: 12 },
        { month: "Mar", irrigation: 180, fertilizer: 38, pesticide: 15 },
        { month: "Apr", irrigation: 220, fertilizer: 42, pesticide: 18 },
        { month: "May", irrigation: 280, fertilizer: 35, pesticide: 22 },
        { month: "Jun", irrigation: 150, fertilizer: 48, pesticide: 10 },
      ]
    };
    
    logFieldMapping('Analytics', {
      soilHealthTrendMonths: analyticsData.soilHealthTrend?.length,
      weatherTrendsMonths: analyticsData.weatherTrends?.length,
      cropYieldCount: analyticsData.cropYields?.length,
      monthlyMetricsMonths: analyticsData.monthlyMetrics?.length
    });
    
    return analyticsData;
  };

  const value: DataContextType = {
    apiData,
    isLoading,
    error,
    refetch: fetchData,
    getOverviewData,
    getWeatherData,
    getSoilData,
    getCropData,
    getAnalyticsData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
