package kishanMitra.demo.service;

import kishanMitra.demo.dto.CropProfile;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CropInfoService {

    /**
     * Provides an expanded static list of common crop profiles for the "Crops" page in the UI.
     * @return A list of CropProfile objects.
     */
    public List<CropProfile> getCropProfiles() {
        return List.of(
                // Kharif Crops (Monsoon)
                new CropProfile("Rice", "Kharif", "Clayey to loamy, good water retention", "110-140 days", "5.5 - 7.0", "High", "Requires puddled fields and warm temperatures."),
                new CropProfile("Maize", "Kharif / Rabi", "Fertile well-drained loam", "90-110 days", "5.8 - 7.2", "Moderate", "Sensitive to waterlogging."),
                new CropProfile("Cotton", "Kharif", "Well-drained, deep loamy soils", "150-180 days", "6.0 - 8.0", "Moderate", "Requires a long, frost-free period."),
                new CropProfile("Soybean", "Kharif", "Well-drained, sandy loam to clay", "90-120 days", "6.0 - 7.5", "Moderate", "Important oilseed and protein source."),
                new CropProfile("Groundnut (Peanut)", "Kharif", "Well-drained sandy loam", "100-130 days", "6.0 - 7.0", "Low to Moderate", "Needs light soil for peg penetration."),
                new CropProfile("Pigeon Pea (Arhar/Tur)", "Kharif", "Light to medium loam, well-drained", "150-180 days", "6.0 - 7.5", "Low (drought tolerant)", "Fixes atmospheric nitrogen."),
                new CropProfile("Sorghum (Jowar)", "Kharif", "Wide range, but prefers loamy soils", "100-120 days", "6.0 - 8.5", "Low (drought resistant)", "Major food and fodder crop."),
                new CropProfile("Pearl Millet (Bajra)", "Kharif", "Light, sandy soils", "75-90 days", "6.0 - 7.5", "Very Low (highly drought resistant)", "Suitable for arid and semi-arid regions."),
                new CropProfile("Mung Bean (Moong)", "Kharif / Zaid", "Well-drained loam", "60-90 days", "6.5 - 7.5", "Low", "Short duration pulse crop."),
                new CropProfile("Sugarcane", "Perennial", "Well-drained loam or clay loam", "300-365 days", "6.5 - 7.5", "Very High", "Requires significant water and nutrients."),

                // Rabi Crops (Winter)
                new CropProfile("Wheat", "Rabi", "Well-drained loam to clay loam", "120-150 days", "6.0 - 7.5", "Moderate (4-5 irrigations)", "India's main cereal crop."),
                new CropProfile("Mustard", "Rabi", "Light to heavy loam", "110-140 days", "6.0 - 7.5", "Low", "Requires cool, dry weather during growth."),
                new CropProfile("Chickpea (Gram/Chana)", "Rabi", "Light to heavy, well-drained soils", "90-110 days", "6.0 - 8.0", "Low", "Most important pulse crop in India."),
                new CropProfile("Barley (Jau)", "Rabi", "Sandy loam to loamy sand", "110-130 days", "6.5 - 8.0", "Low", "Tolerant to saline and alkaline soils."),
                new CropProfile("Lentil (Masoor)", "Rabi", "Light loamy to clayey soils", "100-120 days", "6.0 - 8.0", "Low", "Grown in cooler temperatures."),
                new CropProfile("Potato", "Rabi", "Well-drained sandy loam", "80-100 days", "5.2 - 6.5", "High", "Requires consistent moisture."),
                new CropProfile("Onion", "Rabi / Kharif", "Well-drained, friable loamy soils", "120-150 days", "6.0 - 7.0", "Moderate", "Sensitive to extreme temperatures."),

                // Zaid Crops (Summer)
                new CropProfile("Cucumber", "Zaid", "Sandy loam to loamy soils", "50-70 days", "6.0 - 7.0", "High", "Grows best in warm, humid conditions."),
                new CropProfile("Watermelon", "Zaid", "Sandy, well-drained soils", "80-100 days", "6.0 - 7.0", "Moderate", "Needs long, sunny days.")
        );
    }
}