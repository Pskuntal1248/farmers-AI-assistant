package kishanMitra.demo.dto;

import lombok.Data;

@Data
public class ChatbotRequest {
    private String message;
    private double latitude;
    private double longitude;
    private String languageCode; // e.g., "hi", "en", "te", "bn"
}