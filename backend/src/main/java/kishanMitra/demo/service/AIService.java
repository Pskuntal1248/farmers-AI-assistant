package kishanMitra.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kishanMitra.demo.dto.DashboardData;
import kishanMitra.demo.dto.SoilData;
import kishanMitra.demo.dto.gemini.GeminiRequest;
import kishanMitra.demo.dto.gemini.GeminiResponse;

@Service
public class AIService {
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String mainApiKey;

    @Value("${gemini.secondary.api.key}")
    private String secondaryApiKey;

    @Value("${gemini.tertiary.api.key}")
    private String tertiaryApiKey;

    @Value("${gemini.quaternary.api.key}")
    private String quaternaryApiKey;

    @Value("${gemini.mock.data.api.key}")
    private String mockDataApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public AIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public SoilData getAiMockSoilData(double lat, double lon) {
        String prompt = String.format(
                """
                Act as a soil data simulation API. For the given Indian coordinates (latitude: %f, longitude: %f), generate a plausible set of soil properties.
                Your response MUST be a single, raw JSON object and nothing else.
                The JSON object must have these exact keys and value types:
                {
                  "ph": number (5.5-8.5),
                  "soilOrganicCarbon": number (4-15),
                  "cationExchangeCapacity": number (5-25),
                  "bulkDensity": number (1.1-1.7),
                  "soilType": string,
                  "nitrogen": number, "phosphorus": number, "potassium": number,
                  "electricalConductivity": number, "salinity": number,
                  "sandPercent": number, "siltPercent": number, "clayPercent": number,
                  "subsoilMoisture": number, "soilTemperature": number
                }
                """,
                lat, lon
        );

        String rawResponse = callGeminiApiForData(prompt);
        SoilData soilData = new SoilData();

        // **IMPROVED CHECK**
        // If the API call failed, rawResponse will be null.
        if (rawResponse == null) {
            System.err.println("AI_MOCK_DATA_ERROR: No response from Gemini API. Using defaults.");
            soilData.setPh(6.5);
            soilData.setSoilOrganicCarbon(8.0);
            soilData.setSoilType("Loam");
            soilData.setCationExchangeCapacity(12.0);
            soilData.setBulkDensity(1.4);
            return soilData;
        }

        try {
            String cleanedJson = rawResponse.replace("```json", "").replace("```", "").trim();
            JsonNode rootNode = objectMapper.readTree(cleanedJson);
            soilData.setPh(rootNode.path("ph").asDouble(6.5));
            soilData.setSoilOrganicCarbon(rootNode.path("soilOrganicCarbon").asDouble(8.0));
            soilData.setCationExchangeCapacity(rootNode.path("cationExchangeCapacity").asDouble(12.0));
            soilData.setBulkDensity(rootNode.path("bulkDensity").asDouble(1.4));
            soilData.setSoilType(rootNode.path("soilType").asText("Loam"));
            soilData.setNitrogen(rootNode.path("nitrogen").asDouble(60));
            soilData.setPhosphorus(rootNode.path("phosphorus").asDouble(20));
            soilData.setPotassium(rootNode.path("potassium").asDouble(40));
            soilData.setElectricalConductivity(rootNode.path("electricalConductivity").asDouble(0.5));
            soilData.setSalinity(rootNode.path("salinity").asDouble(0.1));
            soilData.setSandPercent(rootNode.path("sandPercent").asDouble(40));
            soilData.setSiltPercent(rootNode.path("siltPercent").asDouble(30));
            soilData.setClayPercent(rootNode.path("clayPercent").asDouble(30));
            soilData.setSubsoilMoisture(rootNode.path("subsoilMoisture").asDouble(0));
            soilData.setSoilTemperature(rootNode.path("soilTemperature").asDouble(25));
        } catch (Exception e) {
            System.err.println("AI_MOCK_DATA_ERROR: Failed to parse JSON from AI. Using defaults. Error: " + e.getMessage());
            soilData.setPh(6.5);
            soilData.setSoilOrganicCarbon(8.0);
            soilData.setSoilType("Loam");
            soilData.setCationExchangeCapacity(12.0);
            soilData.setBulkDensity(1.4);
            soilData.setNitrogen(60);
            soilData.setPhosphorus(20);
            soilData.setPotassium(40);
            soilData.setElectricalConductivity(0.5);
            soilData.setSalinity(0.1);
            soilData.setSandPercent(40);
            soilData.setSiltPercent(30);
            soilData.setClayPercent(30);
            soilData.setSubsoilMoisture(0);
            soilData.setSoilTemperature(25);
        }
        return soilData;
    }

    public String getBestCropRecommendation(DashboardData data) {
        String prompt = String.format(
                """
                Task: Recommend the single best crop for the given Indian farm context.
                Output: ONE line only -> <Crop name> — <10-20 word reason>. No preface, no extra text.

                Context:
                - Location: %s, %s
                - Season: %s
                - Soil: type=%s, pH=%.1f, SOC=%.1f, CEC=%.1f, bulkDensity=%.1f
                  N=%.1f kg/ha, P=%.1f kg/ha, K=%.1f kg/ha, EC=%.2f dS/m, salinity=%.2f ppt
                  texture: sand=%.0f%%, silt=%.0f%%, clay=%.0f%%
                  moisture(top)=%.2f, moisture(sub)=%.2f, soilTemp=%.1f°C
                - 7-day forecast: avgMaxTemp=%.1f°C, totalRain=%.1f mm
                - Climate normals: avgTemp=%.1f°C, annualRain=%.1f mm, class=%s
                """,
                data.getDistrict(), data.getState(), data.getCurrentSeason(),
                data.getSoilData().getSoilType(), data.getSoilData().getPh(),
                data.getSoilData().getSoilOrganicCarbon(), data.getSoilData().getCationExchangeCapacity(),
                data.getSoilData().getBulkDensity(),
                data.getSoilData().getNitrogen(), data.getSoilData().getPhosphorus(), data.getSoilData().getPotassium(),
                data.getSoilData().getElectricalConductivity(), data.getSoilData().getSalinity(),
                data.getSoilData().getSandPercent(), data.getSoilData().getSiltPercent(), data.getSoilData().getClayPercent(),
                data.getSoilData().getTopsoilMoisture(), data.getSoilData().getSubsoilMoisture(), data.getSoilData().getSoilTemperature(),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getMaxTemp()).average().orElse(0),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getPrecipitationSum()).sum(),
                data.getClimateData().getAverageTemperature(), data.getClimateData().getAnnualRainfall(),
                data.getClimateData().getKoppenGeigerClassification()
        );
        String recommendation = callGeminiApiForData(prompt);
        if (recommendation == null) {
            return "Could not retrieve a recommendation at this time.";
        }
        return toSingleLine(recommendation);
    }

    public String getChatbotResponse(String userMessage, DashboardData data, String languageCode) {
        String prompt = String.format(
                """
                Task: Answer the farmer's question briefly in the specified language.
                Reply language: %s
                Constraints: max 2 sentences; be practical and specific to Indian farming.
                Focus areas: crop choice for max efficiency, input use, pest control, irrigation, soil health, cost-effectiveness. Avoid role-play/disclaimers.

                Context:
                - Location: %s, %s
                - Season: %s
                - Soil: type=%s, pH=%.1f, SOC=%.1f, CEC=%.1f, bulkDensity=%.1f, moisture=%.1f
                - Weather (7d): avgMaxTemp=%.1f°C, totalRain=%.1f mm
                - Climate normals: avgTemp=%.1f°C, annualRain=%.1f mm, class=%s

                Farmer message: "%s"
                """,
                languageCode == null || languageCode.isBlank() ? "en" : languageCode,
                data.getDistrict(), data.getState(), data.getCurrentSeason(),
                data.getSoilData().getSoilType(), data.getSoilData().getPh(),
                data.getSoilData().getSoilOrganicCarbon(), data.getSoilData().getCationExchangeCapacity(),
                data.getSoilData().getBulkDensity(), data.getSoilData().getTopsoilMoisture(),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getMaxTemp()).average().orElse(0),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getPrecipitationSum()).sum(),
                data.getClimateData().getAverageTemperature(), data.getClimateData().getAnnualRainfall(),
                data.getClimateData().getKoppenGeigerClassification(),
                userMessage
        );
        String response = callGeminiApiForChatbot(prompt);
        if (response == null) {
            return "I am sorry, I am having trouble connecting right now. Please try again in a moment.";
        }
        return response.replace("```", "").trim();
    }

    /**
     * Cascading fallback mechanism for chatbot API calls
     * Level 1: Quaternary key (primary for chatbot)
     * Level 2: Tertiary key (rollback for chatbot)
     */
    private String callGeminiApiForChatbot(String prompt) {
        String[] apiKeys = {quaternaryApiKey, tertiaryApiKey};
        String[] keyNames = {"Quaternary (Chatbot Primary)", "Tertiary (Chatbot Rollback)"};
        
        for (int i = 0; i < apiKeys.length; i++) {
            String result = callGeminiApi(prompt, apiKeys[i]);
            if (result != null) {
                if (i > 0) {
                    System.out.println("INFO: Used " + keyNames[i] + " fallback key successfully");
                }
                return result;
            }
            System.err.println("WARNING: " + keyNames[i] + " API key failed, trying next fallback...");
        }
        
        System.err.println("ERROR: All chatbot API keys failed, returning null");
        return null;
    }

    /**
     * Cascading fallback mechanism for data API calls
     * Level 1: Primary key (main for data)
     * Level 2: Secondary key (rollback for data)
     */
    private String callGeminiApiForData(String prompt) {
        String[] apiKeys = {mainApiKey, secondaryApiKey};
        String[] keyNames = {"Primary (Data Main)", "Secondary (Data Rollback)"};
        
        for (int i = 0; i < apiKeys.length; i++) {
            String result = callGeminiApi(prompt, apiKeys[i]);
            if (result != null) {
                if (i > 0) {
                    System.out.println("INFO: Used " + keyNames[i] + " fallback key successfully");
                }
                return result;
            }
            System.err.println("WARNING: " + keyNames[i] + " API key failed, trying next fallback...");
        }
        
        System.err.println("ERROR: All data API keys failed, returning null for hardcoded fallback");
        return null;
    }

    private String callGeminiApi(String prompt, String apiKey) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // Build URL with API key as query parameter
            String urlWithKey = geminiApiUrl + "?key=" + apiKey;
            
            GeminiRequest requestBody = new GeminiRequest(prompt);
            HttpEntity<GeminiRequest> entity = new HttpEntity<>(requestBody, headers);
            
            GeminiResponse response = restTemplate.postForObject(urlWithKey, entity, GeminiResponse.class);
            if (response == null || response.getFirstCandidateText() == null) {
                return null;
            }
            return response.getFirstCandidateText();
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return null;
        }
    }

    public String getFarmerSummary(DashboardData data) {
        String fixedRec = getBestCropRecommendation(data);
        String prompt = String.format(
                """
                Create a very short, farmer-friendly plan in plain language (max 6 bullet points).
                Language: English. No roleplay. Use simple words.
                Include: best crop, why, pesticides/insecticides to prefer (generic names), irrigation need (low/med/high and frequency), fertilizer timing (basal/top-dress), rough harvest window.
                You MUST use this exact crop recommendation and DO NOT change the crop:
                "%s"
                The first bullet MUST start with: Best crop: <that crop> (...reason...)
                Output only the bullets, 1 line each.

                Context:
                - Location: %s, %s; Season: %s
                - Soil: type=%s, pH=%.1f, SOC=%.1f, CEC=%.1f, bulkDensity=%.1f
                  N=%.1f, P=%.1f, K=%.1f, EC=%.2f, salinity=%.2f; texture sand=%.0f%% silt=%.0f%% clay=%.0f%%
                  moisture(top)=%.2f sub=%.2f; soilTemp=%.1f°C
                - 7-day forecast: avgMaxTemp=%.1f°C, totalRain=%.1f mm
                - Climate: avgTemp=%.1f°C, annualRain=%.1f mm, class=%s
                """,
                fixedRec,
                data.getDistrict(), data.getState(), data.getCurrentSeason(),
                data.getSoilData().getSoilType(), data.getSoilData().getPh(), data.getSoilData().getSoilOrganicCarbon(),
                data.getSoilData().getCationExchangeCapacity(), data.getSoilData().getBulkDensity(),
                data.getSoilData().getNitrogen(), data.getSoilData().getPhosphorus(), data.getSoilData().getPotassium(),
                data.getSoilData().getElectricalConductivity(), data.getSoilData().getSalinity(),
                data.getSoilData().getSandPercent(), data.getSoilData().getSiltPercent(), data.getSoilData().getClayPercent(),
                data.getSoilData().getTopsoilMoisture(), data.getSoilData().getSubsoilMoisture(), data.getSoilData().getSoilTemperature(),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getMaxTemp()).average().orElse(0),
                data.getWeatherData().getSevenDayForecast().stream().mapToDouble(d -> d.getPrecipitationSum()).sum(),
                data.getClimateData().getAverageTemperature(), data.getClimateData().getAnnualRainfall(), data.getClimateData().getKoppenGeigerClassification()
        );
        String res = callGeminiApiForData(prompt);
        return res != null ? res.replace("```", "").trim() : null;
    }
    private String toSingleLine(String text) {
        String sanitized = text.replace("```", "").replace("\r", "").trim();
        int newlineIndex = sanitized.indexOf('\n');
        if (newlineIndex > -1) {
            sanitized = sanitized.substring(0, newlineIndex);
        }
        return sanitized.trim();
    }
}