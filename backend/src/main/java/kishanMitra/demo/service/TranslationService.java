package kishanMitra.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Service
public class TranslationService {

    private final RestTemplate restTemplate;

    @Value("${translate.google.api.key:}")
    private String googleApiKey;
    private static final String GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";

    public TranslationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String translateIfNeeded(String text, String targetLang) {
        if (text == null) return null;
        if (targetLang == null || targetLang.isBlank() || Objects.equals(targetLang, "en")) {
            return text;
        }

        String normalized = normalizeTargetLang(targetLang);
        if (Objects.equals(normalized, "en")) {
            return text;
        }

        try {
            String translated = translateWithGoogle(text, normalized);
            if (translated != null && !translated.isBlank()) {
                return translated;
            }
        } catch (Exception e) {
            System.err.println("Google Translate error: " + e.getMessage());
        }

        return text; // fallback to original
    }

    private String normalizeTargetLang(String lang) {
        if (lang == null) return "en";
        return lang.toLowerCase();
    }

    private String translateWithGoogle(String text, String targetLang) {
        if (googleApiKey == null || googleApiKey.isBlank()) return null;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String url = GOOGLE_TRANSLATE_URL + "?key=" + googleApiKey;

        // Minimal JSON body
        String bodyJson = String.format("{\"q\":%s,\"target\":%s,\"format\":\"text\"}",
                toJsonString(text), toJsonString(targetLang));

        HttpEntity<String> entity = new HttpEntity<>(bodyJson, headers);
        JsonNode response = restTemplate.postForObject(url, entity, JsonNode.class);
        if (response == null) return null;
        JsonNode translations = response.path("data").path("translations");
        if (translations.isArray() && translations.size() > 0) {
            JsonNode first = translations.get(0);
            if (first.has("translatedText")) {
                return first.get("translatedText").asText();
            }
        }
        return null;
    }

    private String toJsonString(String s) {
        if (s == null) return "\"\"";
        String escaped = s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
        return "\"" + escaped + "\"";
    }
}

