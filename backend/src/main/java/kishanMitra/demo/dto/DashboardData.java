package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class DashboardData {
    // Location
    private String district;
    private String state;

    // Calculated
    private String currentSeason;
    private double groundwaterIndex; // 0-100 scale

    // Real-time Data
    private SoilData soilData;
    private WeatherData weatherData;
    private ClimateData climateData;
}