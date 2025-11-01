package kishanMitra.demo.service;

import kishanMitra.demo.dto.LocationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service // Marks this class as a Spring service component
public class LocationService {

    private final RestTemplate restTemplate;

    // Injects the API key securely from your application.properties file
    @Value("${openweathermap.api.key}")
    private String apiKey;

    // Spring's dependency injection provides the RestTemplate bean automatically
    public LocationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Converts GPS coordinates into a location (State and District).
     * @param lat The latitude from the mobile app.
     * @param lon The longitude from the mobile app.
     * @return A String array containing {state, district}. Returns {"Unknown", "Unknown"} on failure.
     */
    public String[] getLocationFromCoordinates(double lat, double lon) {
        // Construct the full API URL with the provided coordinates and your API key
        String url = String.format(
                "https://api.openweathermap.org/geo/1.0/reverse?lat=%f&lon=%f&limit=1&appid=%s",
                lat, lon, apiKey
        );

        try {
            // Make the GET request to the OpenWeatherMap API.
            // Spring will automatically map the incoming JSON array to our LocationResponse[] class.
            LocationResponse[] responses = restTemplate.getForObject(url, LocationResponse[].class);

            // Check if the response is valid and contains at least one location
            if (responses != null && responses.length > 0) {
                LocationResponse location = responses[0];
                String state = location.getState() != null ? location.getState() : "Unknown State";
                String district = location.getName() != null ? location.getName() : "Unknown District";

                System.out.println("Location Found: " + district + ", " + state);
                return new String[]{state, district};
            }
        } catch (HttpClientErrorException e) {
            // This will catch errors like 401 (Invalid API Key) or 400 (Bad Request)
            System.err.println("Error calling OpenWeatherMap API: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
        } catch (Exception e) {
            // This will catch other errors like network issues
            System.err.println("An unexpected error occurred: " + e.getMessage());
        }

        // If the API call fails or returns no data, return a default value
        return new String[]{"Unknown", "Unknown"};
    }
}
