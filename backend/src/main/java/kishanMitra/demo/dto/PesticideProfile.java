package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class PesticideProfile {
    private String name;                 // e.g., Imidacloprid 17.8% SL
    private String targetPest;           // e.g., Aphids, Whiteflies
    private String crop;                 // e.g., Cotton, Rice, Vegetables
    private String modeOfAction;         // e.g., Neonicotinoid (IRAC 4A)
    private String toxicity;             // e.g., Moderately hazardous
    private String preHarvestInterval;   // e.g., 7 days
    private String notes;                // e.g., Avoid during flowering; rotate MoA
}

