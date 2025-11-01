package kishanMitra.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CropProfile {
    private String name;
    private String season;
    private String soil;
    private String duration;
    private String ph;
    private String water;
    private String notes;
}