package kishanMitra.demo.dto;

import lombok.Data;

/**
 * Represents the incoming request from the mobile app to the backend.
 * It contains all the necessary data to process a single query.
 */
@Data // Lombok: Automatically creates all the getters, setters, etc. for the fields below.
public class RecommendationRequest {

    /**
     * The raw text of the farmer's question, either typed or from voice-to-text.
     * Example: "What can I grow after cotton?"
     */
    private String message;

    /**
     * The standard code for the language the farmer is using.
     * This tells the backend which language to respond in.
     * Example: "hi" (Hindi), "en" (English), "gu" (Gujarati)
     */
    private String languageCode;

    /**
     * The GPS latitude coordinate from the phone, used for precise location.
     * Example: 28.6139
     */
    private double latitude;

    /**
     * The GPS longitude coordinate from the phone, used for precise location.
     * Example: 77.2090
     */
    private double longitude;

}
