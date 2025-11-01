package kishanMitra.demo.controller;

import kishanMitra.demo.dto.ChatbotRequest;
import kishanMitra.demo.dto.DashboardData;
import kishanMitra.demo.dto.KishanMitraResponse;
import kishanMitra.demo.dto.SummaryResponse;
import kishanMitra.demo.service.AIService;
import kishanMitra.demo.service.DataAggregationService;
import kishanMitra.demo.service.TranslationService;
import org.springframework.web.bind.annotation.*;

/**
 * This is the final, refactored controller for the Kishan Mitra application.
 * It provides a GET endpoint for all dashboard data and a POST endpoint for the intelligent chatbot.
 */
@RestController
@RequestMapping("/api")
public class RecommendationController {

    private final DataAggregationService dataAggregationService;
    private final AIService aiService;
    private final TranslationService translationService;

    // The constructor now injects all the services it needs to delegate tasks to.
    public RecommendationController(DataAggregationService dataAggregationService, AIService aiService, TranslationService translationService) {
        this.dataAggregationService = dataAggregationService;
        this.aiService = aiService;
        this.translationService = translationService;
    }

    /**
     * This is the GET endpoint for the entire frontend dashboard.
     * It fetches all soil, weather, climate, and crop data in a single call.
     *
     * How to use: GET http://localhost:8080/api/all-data?lat=...&lon=...
     */
    @GetMapping("/all-data")
    public KishanMitraResponse getDashboardData(@RequestParam double lat, @RequestParam double lon, @RequestParam(required = false, name = "lang") String lang) {
        // Delegates all the complex data gathering to the aggregation service.
        KishanMitraResponse resp = dataAggregationService.getAllData(lat, lon);
        if (lang != null && !lang.isBlank() && !"en".equals(lang)) {
            // Translate select text fields for UI: recommendation, crop names/notes, pesticide fields, Koppen label
            if (resp.getCropRecommendation() != null) {
                resp.getCropRecommendation().setRecommendationText(
                        translationService.translateIfNeeded(resp.getCropRecommendation().getRecommendationText(), lang)
                );
            }
            if (resp.getCropProfiles() != null) {
                resp.getCropProfiles().forEach(c -> {
                    c.setName(translationService.translateIfNeeded(c.getName(), lang));
                    c.setSeason(translationService.translateIfNeeded(c.getSeason(), lang));
                    c.setSoil(translationService.translateIfNeeded(c.getSoil(), lang));
                    c.setNotes(translationService.translateIfNeeded(c.getNotes(), lang));
                });
            }
            if (resp.getPesticideProfiles() != null) {
                resp.getPesticideProfiles().forEach(p -> {
                    p.setName(translationService.translateIfNeeded(p.getName(), lang));
                    p.setTargetPest(translationService.translateIfNeeded(p.getTargetPest(), lang));
                    p.setCrop(translationService.translateIfNeeded(p.getCrop(), lang));
                    p.setModeOfAction(translationService.translateIfNeeded(p.getModeOfAction(), lang));
                    p.setToxicity(translationService.translateIfNeeded(p.getToxicity(), lang));
                    p.setPreHarvestInterval(translationService.translateIfNeeded(p.getPreHarvestInterval(), lang));
                    p.setNotes(translationService.translateIfNeeded(p.getNotes(), lang));
                });
            }
            if (resp.getDashboardData() != null && resp.getDashboardData().getClimateData() != null) {
                var c = resp.getDashboardData().getClimateData();
                c.setKoppenGeigerClassification(
                        translationService.translateIfNeeded(c.getKoppenGeigerClassification(), lang)
                );
            }
        }
        return resp;
    }

    /**
     * Compact farmer summary endpoint: brief plan and the one-line crop recommendation.
     */
    @GetMapping("/summary")
    public SummaryResponse getFarmerSummary(@RequestParam double lat, @RequestParam double lon, @RequestParam(required = false, name = "lang") String lang) {
        KishanMitraResponse full = dataAggregationService.getAllData(lat, lon);
        SummaryResponse out = new SummaryResponse();
        // one-line recommendation already generated in full
        String oneLine = full.getCropRecommendation() != null ? full.getCropRecommendation().getRecommendationText() : null;
        String bullets = aiService.getFarmerSummary(full.getDashboardData());

        // Optional translation of text
        if (lang != null && !lang.isBlank() && !"en".equals(lang)) {
            if (bullets != null) bullets = translationService.translateIfNeeded(bullets, lang);
            if (oneLine != null) oneLine = translationService.translateIfNeeded(oneLine, lang);
        }
        out.setSummaryText(bullets != null ? bullets : "Could not generate summary.");
        out.setCropRecommendation(oneLine != null ? oneLine : "");
        return out;
    }

    /**
     * This is the POST endpoint for the conversational chatbot.
     * It uses the full data context to provide smart, relevant answers.
     *
     * How to use: POST http://localhost:8080/api/chatbot with a JSON body.
     */
    @PostMapping("/chatbot")
    public String handleChatbotQuery(@RequestBody ChatbotRequest request) {
        // Step 1: Get the full data context for the user's location. This is very efficient
        // as it reuses the same logic as the dashboard.
        KishanMitraResponse fullData = dataAggregationService.getAllData(request.getLatitude(), request.getLongitude());
        DashboardData context = fullData.getDashboardData();

        // Step 2: Pass the user's question AND the rich data context to the AI service.
        return aiService.getChatbotResponse(request.getMessage(), context, request.getLanguageCode());
    }
}