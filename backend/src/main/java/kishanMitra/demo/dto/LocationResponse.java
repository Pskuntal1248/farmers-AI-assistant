package kishanMitra.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * A simple Data Transfer Object (DTO) to map the JSON response
 * from the OpenWeatherMap Geocoding API.
 */
@Data
// This annotation is very useful. It tells the JSON parser to ignore any fields
// in the JSON response that we haven't defined in this class, preventing errors.
@JsonIgnoreProperties(ignoreUnknown = true)
public class LocationResponse {

    /**
     * This field will hold the city or district name from the API response.
     * Example: "Nashik"
     */
    private String name;

    /**
     * This field will hold the state name from the API response.
     * Example: "Maharashtra"
     */
    private String state;
}
