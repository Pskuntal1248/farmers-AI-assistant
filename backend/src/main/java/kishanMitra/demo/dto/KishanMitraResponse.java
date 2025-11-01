package kishanMitra.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class KishanMitraResponse {
    private DashboardData dashboardData;
    private AiCropRecommendation cropRecommendation;
    private List<CropProfile> cropProfiles;
    private List<PesticideProfile> pesticideProfiles;
}