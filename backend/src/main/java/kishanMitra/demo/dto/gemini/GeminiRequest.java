package kishanMitra.demo.dto.gemini;

import java.util.List;
import lombok.Data;

@Data
public class GeminiRequest {
    private List<Content> contents;
    public GeminiRequest(String text) {
        this.contents = List.of(new Content(List.of(new Part(text))));
    }
}

@Data
class Content {
    private List<Part> parts;
    public Content(List<Part> parts) { this.parts = parts; }
}

@Data
class Part {
    private String text;
    public Part(String text) { this.text = text; }
}
