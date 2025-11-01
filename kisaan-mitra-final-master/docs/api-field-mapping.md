# API Field Mapping Documentation

This document explains how the Kisaan Mitra application maps API response fields to different pages and components.

## Overview

The application uses a single API endpoint (`/api/all-data`) that returns comprehensive agricultural data. This data is then mapped to specific pages based on their requirements.

## Page-Specific Field Mappings

### Overview Page
**Accessed via:** `getOverviewData()`

**Primary Fields:**
- `district` → Location district name
- `state` → Location state name 
- `currentSeason` / `season` → Current agricultural season
- `groundwaterIndex` / `groundwater` → Groundwater availability index
- `temperature` / `temp` → Current temperature
- `humidity` → Current humidity percentage
- `weatherAlert` / `weather_alert` → Weather warnings/alerts
- `soilHealthInfo` / `soil_health` / `soilInfo` → Soil condition summary

**Usage in Components:**
- DashboardHeader: Uses district, state, currentSeason
- Metric Cards: Uses temperature, humidity, groundwaterIndex
- Quick Insights: Uses weatherAlert, soilHealthInfo

### Weather Page
**Accessed via:** `getWeatherData()`

**Primary Fields:**
- `temperature` / `temp` → Current temperature
- `humidity` → Current humidity
- `windSpeed` → Wind speed
- `realFeel` → Apparent temperature  
- `windGust` → Wind gust speed
- `pressure` → Atmospheric pressure
- `visibility` → Visibility distance
- `uvIndex` → UV index
- `sevenDayForecast` → 7-day weather forecast array
- `averageTemperature` → Annual average temperature
- `annualRainfall` → Annual rainfall amount
- `koppenGeigerClassification` → Climate classification

**Nested Object Support:**
- Can also read from `weatherData.*` nested object
- Example: `weatherData.temperature`, `weatherData.sevenDayForecast`

**Usage in Components:**
- WeatherCard: Uses current weather conditions
- TemperatureChart: Uses sevenDayForecast
- Climate Profile: Uses averageTemperature, annualRainfall, koppenGeigerClassification

### Soil Page
**Accessed via:** `getSoilData()`

**Primary Fields:**
- `ph` → Soil pH level
- `soilOrganicCarbon` → Organic carbon content
- `topsoilMoisture` → Soil moisture percentage
- `soilType` → Soil type classification
- `cationExchangeCapacity` → CEC value
- `bulkDensity` → Soil bulk density
- `soilHealthScore` → Overall soil health score

**Nested Object Support:**
- Can also read from `soilData.*` nested object
- Example: `soilData.ph`, `soilData.soilHealthScore`

**Usage in Components:**
- SoilDataCard: Uses all soil properties
- SoilMetricsChart: Uses ph, moisture, organic carbon
- Health Score Card: Uses soilHealthScore

### Crops Page
**Accessed via:** `getCropData()`

**Primary Fields:**
- `recommendationText` → AI-generated crop recommendations
- `currentSeason` / `season` → Current growing season
- `cropProfiles` → Array of crop information objects

**Nested Object Support:**
- Can also read from `cropData.*` nested object
- Example: `cropData.recommendationText`, `cropData.profiles`

**Crop Profile Structure:**
Each crop profile contains:
- `name` → Crop name
- `season` → Growing season
- `soil` → Soil requirements
- `duration` → Growing duration
- `ph` → pH requirements
- `water` → Water requirements
- `notes` → Additional notes

**Usage in Components:**
- CropRecommendation: Uses recommendationText, currentSeason
- CropProfileCard: Uses individual crop profiles
- CropDistributionChart: Uses cropProfiles array

### Analytics Page
**Accessed via:** `getAnalyticsData()`

**Primary Fields:**
- `soilHealthTrend` → Array of monthly soil health data
- `weatherTrends` → Array of monthly weather patterns
- `cropYields` → Array of crop yield vs target data
- `monthlyMetrics` → Array of resource usage data

**Nested Object Support:**
- Can also read from `analyticsData.*` nested object
- Example: `analyticsData.soilHealthTrend`

**Data Structures:**
- **soilHealthTrend**: `{month, health, ph, moisture}`
- **weatherTrends**: `{month, avgTemp, rainfall, humidity}`
- **cropYields**: `{crop, yield, target}`
- **monthlyMetrics**: `{month, irrigation, fertilizer, pesticide}`

**Usage in Components:**
- Various chart components use specific analytics arrays
- KPI cards use aggregated metrics from the data

## Fallback Strategy

The application implements a multi-level fallback strategy:

1. **Primary Field**: Direct API field (e.g., `temperature`)
2. **Alternative Field**: Common alternative (e.g., `temp`)  
3. **Nested Object**: Structured data (e.g., `weatherData.temperature`)
4. **Default Value**: Hardcoded fallback for development

Example:
```typescript
temperature: apiData?.temperature ?? apiData?.temp ?? apiData?.weatherData?.temperature ?? 24.5
```

## Debugging

The application includes debug logging (development mode only) that shows:
- Which fields are being mapped for each page
- What values are being used (actual API data vs fallbacks)
- Field mapping success/failure

Check browser console for messages like:
```
Overview data mapping: {district: "Delhi", temperature: 25.5, ...}
Weather data mapping: {temperature: 25.5, forecastDays: 7, ...}
```

## Adding New Fields

To add support for new API fields:

1. **Update Interface**: Add field to appropriate interface in `DataContext.tsx`
2. **Update Getter**: Add field mapping in the relevant getter function
3. **Add Fallback**: Include fallback chain with default value
4. **Update Components**: Use the field in relevant page components
5. **Test**: Verify field works with and without API data

## API Response Structure

The actual API response has a nested structure with a top-level `dashboardData` object containing most of the agricultural information:

### Actual API Response Format
```json
{
  "dashboardData": {
    "district": "Ghaziabad",
    "state": "Uttar Pradesh", 
    "currentSeason": "Kharif (Monsoon)",
    "groundwaterIndex": 100,
    "soilData": {
      "ph": 7.2,
      "soilOrganicCarbon": 8.5,
      "topsoilMoisture": 0,
      "soilType": "Clay Loam",
      "nitrogen": 25,
      "phosphorus": 30,
      "potassium": 180,
      "sandPercent": 30,
      "siltPercent": 40,
      "clayPercent": 30,
      "soilTemperature": 24.6
    },
    "weatherData": {
      "current": {
        "temperature": 25.5,
        "humidity": 78,
        "windSpeed": 3.8,
        "realFeel": 29.6,
        "pressure": 1002.8,
        "visibility": 24140,
        "uvIndex": 0
      },
      "sevenDayForecast": [
        {
          "date": "2025-09-24",
          "maxTemp": 35.4,
          "minTemp": 25.6,
          "precipitationSum": 0,
          "windMax": 10.8,
          "uvMax": 6.4
        }
      ]
    },
    "climateData": {
      "averageTemperature": 24.69,
      "annualRainfall": 719.93,
      "koppenGeigerClassification": "Tropical savanna (Aw)"
    }
  },
  "cropRecommendation": {
    "recommendationText": "Bajra — Tolerant to drought..."
  },
  "cropProfiles": [
    {
      "name": "Rice",
      "season": "Kharif",
      "soil": "Clayey to loamy, good water retention",
      "duration": "110-140 days",
      "ph": "5.5 - 7.0",
      "water": "High",
      "notes": "Requires puddled fields and warm temperatures."
    }
  ],
  "pesticideProfiles": [
    {
      "name": "Imidacloprid 17.8% SL",
      "targetPest": "Aphids, Whiteflies, Jassids",
      "crop": "Cotton, Vegetables",
      "modeOfAction": "Neonicotinoid (IRAC 4A)",
      "toxicity": "Moderate; avoid during flowering",
      "preHarvestInterval": "7 days",
      "notes": "Apply early; rotate MoA"
    }
  ]
}
```

### Legacy Support
The system still supports flat structure responses through fallbacks for backward compatibility.
