package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class ClimateData {
    private double averageTemperature; // 30-year average temp
    private double annualRainfall;     // 30-year average rainfall in mm
    private String koppenGeigerClassification; // e.g., "Tropical savanna climate"
    private double hottestMonthAvgMax;
    private double coldestMonthAvgMin;
    private double driestMonthRain;
}