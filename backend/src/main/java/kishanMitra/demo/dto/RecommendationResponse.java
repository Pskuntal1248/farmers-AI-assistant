package kishanMitra.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the final, simple response sent from the backend to the mobile app.
 */
@Data               // Lombok: Automatically creates getters, setters, toString(), etc.
@AllArgsConstructor // Lombok: Creates a constructor that accepts all fields (e.g., new RecommendationResponse("some text")).
@NoArgsConstructor  // Lombok: Creates an empty constructor (e.g., new RecommendationResponse()).
public class RecommendationResponse {

    /**
     * This field will hold the final, translated answer to be displayed to the farmer.
     * Example: "Based on your location, you can consider growing Wheat or Mustard."
     */
    private String response;

}
