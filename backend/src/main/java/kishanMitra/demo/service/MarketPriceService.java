package kishanMitra.demo.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import kishanMitra.demo.dto.MarketPrice;

@Service
public class MarketPriceService {

    @Value("${agmarknet.api.url:http://localhost:5000}")
    private String agmarknetApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Cache to store prices and reduce API calls
    private final Map<String, List<MarketPrice>> priceCache = new HashMap<>();
    private final Map<String, Long> cacheTimestamp = new HashMap<>();
    private static final long CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

    /**
     * Get market prices for a commodity in a specific state and market
     * First tries the live API, falls back to mock data if unavailable
     */
    public List<MarketPrice> getMarketPrices(String commodity, String state, String market) {
        String cacheKey = commodity + "_" + state + "_" + market;
        
        // Check cache first
        if (isCacheValid(cacheKey)) {
            return priceCache.get(cacheKey);
        }

        try {
            // Try to call the Python agmarknet API
            String url = String.format("%s/request?commodity=%s&state=%s&market=%s", 
                agmarknetApiUrl, commodity, state, market);
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<MarketPrice> prices = parseApiResponse(response.getBody(), state);
                priceCache.put(cacheKey, prices);
                cacheTimestamp.put(cacheKey, System.currentTimeMillis());
                return prices;
            }
        } catch (Exception e) {
            System.err.println("Error fetching from agmarknet API: " + e.getMessage());
        }

        // Fallback to mock data
        return getMockMarketPrices(commodity, state, market);
    }

    /**
     * Get market prices for multiple commodities (default list for a state)
     */
    public List<MarketPrice> getDefaultMarketPrices(String state) {
        List<String> defaultCommodities = Arrays.asList(
            "Rice", "Wheat", "Potato", "Onion", "Tomato", 
            "Maize", "Soybean", "Mustard", "Chickpea", "Cotton"
        );
        
        List<MarketPrice> allPrices = new ArrayList<>();
        
        // Get prices for each commodity - using mock data for reliability
        for (String commodity : defaultCommodities) {
            allPrices.addAll(getMockMarketPrices(commodity, state, getDefaultMarket(state)));
        }
        
        return allPrices;
    }

    private boolean isCacheValid(String cacheKey) {
        if (!priceCache.containsKey(cacheKey)) return false;
        Long timestamp = cacheTimestamp.get(cacheKey);
        return timestamp != null && (System.currentTimeMillis() - timestamp) < CACHE_DURATION_MS;
    }

    private List<MarketPrice> parseApiResponse(String jsonResponse, String state) {
        List<MarketPrice> prices = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            if (root.isArray()) {
                for (JsonNode node : root) {
                    MarketPrice price = new MarketPrice();
                    price.setSerialNo(node.path("S.No").asText());
                    price.setMarket(node.path("City").asText());
                    price.setCommodity(node.path("Commodity").asText());
                    price.setVariety("Local");
                    price.setMinPrice(parseDouble(node.path("Min Prize").asText()));
                    price.setMaxPrice(parseDouble(node.path("Max Prize").asText()));
                    price.setModalPrice(parseDouble(node.path("Model Prize").asText()));
                    price.setDate(node.path("Date").asText());
                    price.setState(state);
                    prices.add(price);
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing API response: " + e.getMessage());
        }
        return prices;
    }

    private Double parseDouble(String value) {
        try {
            return Double.parseDouble(value.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String getDefaultMarket(String state) {
        Map<String, String> stateMarkets = Map.ofEntries(
            // Major States
            Map.entry("Delhi", "Azadpur"),
            Map.entry("Maharashtra", "Mumbai"),
            Map.entry("Karnataka", "Bangalore"),
            Map.entry("Tamil Nadu", "Chennai"),
            Map.entry("Gujarat", "Ahmedabad"),
            Map.entry("Uttar Pradesh", "Lucknow"),
            Map.entry("Punjab", "Ludhiana"),
            Map.entry("Haryana", "Karnal"),
            Map.entry("Rajasthan", "Jaipur"),
            Map.entry("Madhya Pradesh", "Bhopal"),
            Map.entry("West Bengal", "Kolkata"),
            Map.entry("Bihar", "Patna"),
            Map.entry("Andhra Pradesh", "Vijayawada"),
            Map.entry("Telangana", "Hyderabad"),
            Map.entry("Kerala", "Kochi"),
            Map.entry("Odisha", "Bhubaneswar"),
            // Additional States
            Map.entry("Assam", "Guwahati"),
            Map.entry("Jharkhand", "Ranchi"),
            Map.entry("Chhattisgarh", "Raipur"),
            Map.entry("Uttarakhand", "Dehradun"),
            Map.entry("Himachal Pradesh", "Shimla"),
            Map.entry("Jammu and Kashmir", "Jammu"),
            Map.entry("Goa", "Panaji"),
            Map.entry("Tripura", "Agartala"),
            Map.entry("Meghalaya", "Shillong"),
            Map.entry("Manipur", "Imphal"),
            Map.entry("Nagaland", "Kohima"),
            Map.entry("Arunachal Pradesh", "Itanagar"),
            Map.entry("Mizoram", "Aizawl"),
            Map.entry("Sikkim", "Gangtok"),
            // Union Territories
            Map.entry("Chandigarh", "Chandigarh"),
            Map.entry("Puducherry", "Puducherry"),
            Map.entry("Ladakh", "Leh"),
            Map.entry("Andaman and Nicobar", "Port Blair"),
            Map.entry("Dadra and Nagar Haveli", "Silvassa"),
            Map.entry("Lakshadweep", "Kavaratti")
        );
        return stateMarkets.getOrDefault(state, "Local Market");
    }

    /**
     * Generate realistic mock market prices when API is unavailable
     */
    private List<MarketPrice> getMockMarketPrices(String commodity, String state, String market) {
        List<MarketPrice> prices = new ArrayList<>();
        Random random = new Random(commodity.hashCode() + state.hashCode());
        
        // Base prices per quintal (100 kg) in INR
        Map<String, double[]> basePrices = Map.ofEntries(
            Map.entry("Rice", new double[]{2800, 3500, 3150}),
            Map.entry("Wheat", new double[]{2200, 2800, 2500}),
            Map.entry("Potato", new double[]{1200, 2000, 1600}),
            Map.entry("Onion", new double[]{1500, 3500, 2500}),
            Map.entry("Tomato", new double[]{1800, 4000, 2800}),
            Map.entry("Maize", new double[]{1800, 2400, 2100}),
            Map.entry("Soybean", new double[]{4500, 5500, 5000}),
            Map.entry("Mustard", new double[]{5000, 6500, 5750}),
            Map.entry("Chickpea", new double[]{5500, 7000, 6250}),
            Map.entry("Cotton", new double[]{6500, 8000, 7250}),
            Map.entry("Sugarcane", new double[]{350, 450, 400}),
            Map.entry("Groundnut", new double[]{5500, 7500, 6500}),
            Map.entry("Sorghum", new double[]{2800, 3600, 3200}),
            Map.entry("Pearl Millet", new double[]{2200, 2800, 2500}),
            Map.entry("Barley", new double[]{1800, 2400, 2100}),
            Map.entry("Lentil", new double[]{6000, 8000, 7000}),
            Map.entry("Mung Bean", new double[]{7500, 9500, 8500}),
            Map.entry("Pigeon Pea", new double[]{7000, 9000, 8000}),
            Map.entry("Cucumber", new double[]{2000, 3500, 2750}),
            Map.entry("Watermelon", new double[]{1500, 2500, 2000})
        );

        double[] basePrice = basePrices.getOrDefault(commodity, new double[]{2000, 3000, 2500});
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        
        // Generate prices for last 7 days
        for (int i = 0; i < 7; i++) {
            LocalDate date = LocalDate.now().minusDays(i);
            
            // Add some daily variation (±10%)
            double variation = 0.9 + (random.nextDouble() * 0.2);
            
            MarketPrice price = new MarketPrice();
            price.setSerialNo(String.valueOf(i + 1));
            price.setMarket(market);
            price.setCommodity(commodity);
            price.setVariety("Local");
            price.setMinPrice(Math.round(basePrice[0] * variation * 100.0) / 100.0);
            price.setMaxPrice(Math.round(basePrice[1] * variation * 100.0) / 100.0);
            price.setModalPrice(Math.round(basePrice[2] * variation * 100.0) / 100.0);
            price.setDate(date.format(formatter));
            price.setState(state);
            prices.add(price);
        }
        
        return prices;
    }

    /**
     * Get list of available commodities
     */
    public List<String> getAvailableCommodities() {
        return Arrays.asList(
            "Rice", "Wheat", "Potato", "Onion", "Tomato",
            "Maize", "Soybean", "Mustard", "Chickpea", "Cotton",
            "Sugarcane", "Groundnut", "Sorghum", "Pearl Millet",
            "Barley", "Lentil", "Mung Bean", "Pigeon Pea",
            "Cucumber", "Watermelon"
        );
    }

    /**
     * Get list of available states
     */
    public List<String> getAvailableStates() {
        return Arrays.asList(
            // Major Agricultural States
            "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal",
            // Union Territories
            "Andaman and Nicobar", "Chandigarh", "Dadra and Nagar Haveli",
            "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
            "Arunachal Pradesh"
        );
    }
}
