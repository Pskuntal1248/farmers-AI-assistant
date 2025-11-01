package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class SummaryResponse {
    private String summaryText;        // short, farmer-friendly plan
    private String cropRecommendation; // the one-line crop recommendation reused
}


