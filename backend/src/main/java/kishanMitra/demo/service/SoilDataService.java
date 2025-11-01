package kishanMitra.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import kishanMitra.demo.dto.SoilData;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class SoilDataService {

    private final RestTemplate restTemplate;
    private final AIService aiService;

    public SoilDataService(RestTemplate restTemplate, AIService aiService) {
        this.restTemplate = restTemplate;
        this.aiService = aiService;
    }

    /**
     * The main method to get soil data. It now uses the AI Simulator as its primary source.
     * If the AI fails, it throws an exception to trigger the hardcoded mock fallback.
     */
    public SoilData getSoilData(double lat, double lon) {
        System.out.println("--- Using Gemini AI Soil Simulator as primary data source... ---");
        SoilData aiMockData = aiService.getAiMockSoilData(lat, lon);

        // Check if the AI failed and returned its default, hardcoded values.
        // This indicates that the AI API key might be exhausted or the service is down.
        if (aiMockData.getPh() == 6.5 && aiMockData.getSoilOrganicCarbon() == 8.0) {
            System.out.println("--- AI Soil Simulator failed or returned default values. Triggering final fallback... ---");
            // We throw a specific exception to trigger the final fallback in the DataAggregationService.
            throw new RuntimeException("AI_SOIL_SIMULATOR_FAILED");
        }

        // If the AI call was successful, we still add the real-time moisture for a dynamic feel.
        aiMockData.setTopsoilMoisture(fetchOpenMeteoProperty(lat, lon, "soil_moisture_0_to_7cm"));
        enrichWithOptionalProperties(aiMockData, lat, lon);
        return aiMockData;
    }

    /**
     * Calculates a "Groundwater Index" based on total rainfall in the last 90 days.
     */
    public double getGroundwaterIndex(double lat, double lon) {
        // Open-Meteo archive caps end_date at "today" in UTC; use yesterday to avoid boundary errors
        LocalDate endDate = LocalDate.now().minusDays(1);
        LocalDate startDate = endDate.minusDays(90);
        String url = String.format(
                "https://archive-api.open-meteo.com/v1/archive?latitude=%f&longitude=%f&start_date=%s&end_date=%s&daily=precipitation_sum",
                lat, lon, startDate.format(DateTimeFormatter.ISO_LOCAL_DATE), endDate.format(DateTimeFormatter.ISO_LOCAL_DATE)
        );
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            double totalRainfall = 0;
            if (response != null) {
                for (JsonNode dailyRain : response.path("daily").path("precipitation_sum")) {
                    totalRainfall += dailyRain.asDouble();
                }
            }
            double index = (totalRainfall / 400.0) * 100;
            return Math.min(index, 100.0);
        } catch (Exception e) {
            System.err.println("GROUNDWATER_INDEX_ERROR: " + e.getMessage());
            return 0; // Return a default value on failure
        }
    }

    /**
     * Fetches real-time topsoil moisture from the reliable Open-Meteo API.
     */
    private double fetchOpenMeteoProperty(double lat, double lon, String property) {
        String url = String.format("https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&current=%s", lat, lon, property);
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            return response.path("current").path(property).asDouble(0);
        } catch (Exception e) {
            System.err.println("OPENMETEO_REQUEST_FAILED for " + property + ": " + e.getMessage());
            return 0;
        }
    }

    // Optionally fetch subsoil moisture and soil temperature when available
    private void enrichWithOptionalProperties(SoilData soilData, double lat, double lon) {
        try {
            double subMoist = fetchOpenMeteoProperty(lat, lon, "soil_moisture_7_to_28cm");
            soilData.setSubsoilMoisture(subMoist);
        } catch (Exception ignored) {}
        try {
            double soilTemp = fetchOpenMeteoProperty(lat, lon, "soil_temperature_0cm");
            soilData.setSoilTemperature(soilTemp);
        } catch (Exception ignored) {}
    }
}