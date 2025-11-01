package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class SoilData {
    private double ph;
    private double soilOrganicCarbon;
    private double topsoilMoisture;
    private String soilType;
    private double cationExchangeCapacity; // CEC - Nutrient holding capacity
    private double bulkDensity;            // Soil compaction
    private double nitrogen;               // kg/ha (estimated)
    private double phosphorus;             // kg/ha (estimated)
    private double potassium;              // kg/ha (estimated)
    private double electricalConductivity; // dS/m
    private double salinity;               // ppt (approx)
    private double sandPercent;            // % of sand
    private double siltPercent;            // % of silt
    private double clayPercent;            // % of clay
    private double subsoilMoisture;        // 7-28 cm layer
    private double soilTemperature;        // near-surface soil temperature (°C)
}