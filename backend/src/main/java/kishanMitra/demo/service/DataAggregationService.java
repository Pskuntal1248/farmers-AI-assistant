package kishanMitra.demo.service;

import kishanMitra.demo.dto.*;
import org.springframework.stereotype.Service;
import java.time.Month;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class DataAggregationService {

    private final DevelopmentDataService developmentDataService;
    private final LocationService locationService;
    private final SoilDataService soilDataService;
    private final WeatherDataService weatherDataService;
    private final ClimateDataService climateDataService;
    private final AIService aiService;
    private final CropInfoService cropInfoService;
    private final PesticideInfoService pesticideInfoService;

    public DataAggregationService(DevelopmentDataService developmentDataService, LocationService locationService,
                                  SoilDataService soilDataService, WeatherDataService weatherDataService,
                                  ClimateDataService climateDataService, AIService aiService, CropInfoService cropInfoService,
                                  PesticideInfoService pesticideInfoService) {
        this.developmentDataService = developmentDataService;
        this.locationService = locationService;
        this.soilDataService = soilDataService;
        this.weatherDataService = weatherDataService;
        this.climateDataService = climateDataService;
        this.aiService = aiService;
        this.cropInfoService = cropInfoService;
        this.pesticideInfoService = pesticideInfoService;
    }

    public KishanMitraResponse getAllData(double lat, double lon) {
        // --- Step 1: Always get the real location first. ---
        String[] location = locationService.getLocationFromCoordinates(lat, lon);
        String state = location[0];
        String district = location[1];

        try {
            // --- Step 2: Get all other data. The soil service now handles its own primary logic. ---
            SoilData soilData = soilDataService.getSoilData(lat, lon);
            WeatherData weatherData = weatherDataService.getWeatherData(lat, lon);
            ClimateData climateData = climateDataService.getClimateProfile(lat, lon);
            double groundwaterIndex = soilDataService.getGroundwaterIndex(lat, lon);
            String season = getCurrentSeason();

            // --- Step 3: Assemble the dashboard data ---
            DashboardData dashboardData = new DashboardData();
            dashboardData.setDistrict(district);
            dashboardData.setState(state);
            dashboardData.setSoilData(soilData);
            dashboardData.setWeatherData(weatherData);
            dashboardData.setClimateData(climateData);
            dashboardData.setCurrentSeason(season);
            dashboardData.setGroundwaterIndex(groundwaterIndex);

            // --- Step 4: Get the AI recommendation ---
            String recommendationText = aiService.getBestCropRecommendation(dashboardData);
            AiCropRecommendation recommendation = new AiCropRecommendation();
            recommendation.setRecommendationText(recommendationText);

            // --- Step 5: Get static crop profiles ---
            List<CropProfile> cropProfiles = cropInfoService.getCropProfiles();
            var pesticideProfiles = pesticideInfoService.getPesticideProfiles();

            // --- Step 6: Build and return the final response ---
            KishanMitraResponse finalResponse = new KishanMitraResponse();
            finalResponse.setDashboardData(dashboardData);
            finalResponse.setCropRecommendation(recommendation);
            finalResponse.setCropProfiles(cropProfiles);
            finalResponse.setPesticideProfiles(pesticideProfiles);
            return finalResponse;

        } catch (Exception e) {
            // --- ULTIMATE FALLBACK ---
            // **THIS IS THE FIX for the logging error.**
            System.err.println(String.format("--- CRITICAL API FAILURE: Switching to full hardcoded mock data mode. Error: %s", e.getMessage()));
            return developmentDataService.getMockData(district, state);
        }
    }

    private String getCurrentSeason() {
        Month month = ZonedDateTime.now().getMonth();
        return switch (month) {
            case JUNE, JULY, AUGUST, SEPTEMBER, OCTOBER -> "Kharif (Monsoon)";
            case NOVEMBER, DECEMBER, JANUARY, FEBRUARY, MARCH -> "Rabi (Winter)";
            default -> "Zaid (Summer)";
        };
    }
}