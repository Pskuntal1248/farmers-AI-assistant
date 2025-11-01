package kishanMitra.demo.service;

import kishanMitra.demo.dto.*;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class DevelopmentDataService {

    /**
     * Provides a complete, hardcoded fallback response.
     * Crucially, it accepts the real location to make the mock data feel authentic.
     * This is the final safety net if all live APIs fail.
     *
     * @param district The real district name from LocationService.
     * @param state The real state name from LocationService.
     * @return A complete KishanMitraResponse object with realistic mock data.
     */
    public KishanMitraResponse getMockData(String district, String state) {
        // --- Mock Dashboard Data ---
        DashboardData dashboardData = new DashboardData();
        dashboardData.setDistrict(district); // Use the real location
        dashboardData.setState(state);       // Use the real location
        dashboardData.setCurrentSeason("Rabi (Winter)");
        dashboardData.setGroundwaterIndex(75.0);

        // --- Mock Soil Data ---
        SoilData soilData = new SoilData();
        soilData.setPh(6.8);
        soilData.setSoilOrganicCarbon(8.5);
        soilData.setTopsoilMoisture(22.5);
        soilData.setSoilType("Clay Loam");
        soilData.setCationExchangeCapacity(15.2);
        soilData.setBulkDensity(1.3);
        dashboardData.setSoilData(soilData);

        // --- Mock Weather Data ---
        WeatherData weatherData = new WeatherData();
        WeatherData.CurrentWeather currentWeather = new WeatherData.CurrentWeather();
        currentWeather.setTemperature(24.5);
        currentWeather.setHumidity(65.0);
        currentWeather.setWindSpeed(10.2);
        currentWeather.setRealFeel(25.0);
        weatherData.setCurrent(currentWeather);
        // Create a simple 7-day forecast
        List<WeatherData.DailyForecast> forecastList = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            WeatherData.DailyForecast forecast = new WeatherData.DailyForecast();
            forecast.setDate("2025-09-" + (24 + i));
            forecast.setMaxTemp(28.0 + (i * 0.5));
            forecast.setMinTemp(18.0 + (i * 0.5));
            forecast.setPrecipitationSum(i == 2 ? 5.0 : 0.0);
            forecastList.add(forecast);
        }
        weatherData.setSevenDayForecast(forecastList);
        dashboardData.setWeatherData(weatherData);

        // --- Mock Climate Data ---
        ClimateData climateData = new ClimateData();
        climateData.setAverageTemperature(25.5);
        climateData.setAnnualRainfall(1200);
        climateData.setKoppenGeigerClassification("Tropical Savanna");
        dashboardData.setClimateData(climateData);

        // --- Mock AI Recommendation ---
        AiCropRecommendation recommendation = new AiCropRecommendation();
        recommendation.setRecommendationText("Based on the typical clay loam soil in your area and the upcoming dry spell, consider planting Chickpea (Gram) or Wheat for the Rabi season.");

        // --- Static Crop Profiles (from CropInfoService) ---
        CropInfoService cropInfoService = new CropInfoService();
        List<CropProfile> cropProfiles = cropInfoService.getCropProfiles();

        // --- Assemble Final Response ---
        KishanMitraResponse finalResponse = new KishanMitraResponse();
        finalResponse.setDashboardData(dashboardData);
        finalResponse.setCropRecommendation(recommendation);
        finalResponse.setCropProfiles(cropProfiles);

        return finalResponse;
    }
}