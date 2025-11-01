package kishanMitra.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import kishanMitra.demo.dto.ClimateData;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ClimateDataService {

    private final RestTemplate restTemplate;

    public ClimateDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ClimateData getClimateProfile(double lat, double lon) {
        // This API provides 30-year climate normals (1991-2020)
        String url = String.format(
                "https://climate-api.open-meteo.com/v1/climate?latitude=%f&longitude=%f&models=CMCC_CM2_VHR4&temperature_unit=celsius&precipitation_unit=mm" +
                        "&start_date=1991-01-01&end_date=2020-12-31" +
                        "&daily=temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum",
                lat, lon
        );

        ClimateData climateData = new ClimateData();
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response != null && response.has("daily")) {
                double tempSum = 0;
                double precipSum = 0;
                int count = 0;

                JsonNode tempsMean = response.path("daily").path("temperature_2m_mean");
                JsonNode tempsMax = response.path("daily").path("temperature_2m_max");
                JsonNode tempsMin = response.path("daily").path("temperature_2m_min");
                JsonNode precips = response.path("daily").path("precipitation_sum");

                double hottestMax = Double.NEGATIVE_INFINITY;
                double coldestMin = Double.POSITIVE_INFINITY;
                double driest = Double.POSITIVE_INFINITY;

                for (int i = 0; i < tempsMean.size(); i++) {
                    tempSum += tempsMean.get(i).asDouble();
                    precipSum += precips.get(i).asDouble();
                    count++;

                    hottestMax = Math.max(hottestMax, tempsMax.get(i).asDouble());
                    coldestMin = Math.min(coldestMin, tempsMin.get(i).asDouble());
                    driest = Math.min(driest, precips.get(i).asDouble());
                }

                if (count > 0) {
                    climateData.setAverageTemperature(tempSum / count);
                    // Average daily rainfall * 365.25 to get annual average over 30 years
                    climateData.setAnnualRainfall((precipSum / count) * 365.25);
                    climateData.setHottestMonthAvgMax(hottestMax);
                    climateData.setColdestMonthAvgMin(coldestMin);
                    climateData.setDriestMonthRain(driest);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching climate data: " + e.getMessage());
        }

        // This is a simplified lookup. A more advanced version could use a dedicated library.
        climateData.setKoppenGeigerClassification(getKoppenClassification(climateData.getAverageTemperature(), climateData.getAnnualRainfall()));

        return climateData;
    }

    private String getKoppenClassification(double avgTemp, double annualRainfall) {
        if (avgTemp >= 18) { // Tropical
            if (annualRainfall > 2000) return "Tropical rainforest (Af)";
            if (annualRainfall > 1500) return "Tropical monsoon (Am)";
            return "Tropical savanna (Aw)";
        }
        if (avgTemp > -3 && avgTemp < 18) { // Temperate
            if (annualRainfall > 1000) return "Humid subtropical (Cfa)";
            return "Mediterranean (Csa)";
        }
        return "Arid (BWh)"; // Arid/Continental
    }
}