package kishanMitra.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import kishanMitra.demo.dto.WeatherData;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;

@Service
public class WeatherDataService {

    private final RestTemplate restTemplate;

    public WeatherDataService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public WeatherData getWeatherData(double lat, double lon) {
        String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%f&longitude=%f&timezone=auto" +
                        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_gusts_10m,pressure_msl,visibility,uv_index" +
                        "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max",
                lat, lon
        );

        WeatherData weatherData = new WeatherData();
        try {
            JsonNode response = restTemplate.getForObject(url, JsonNode.class);
            if (response == null) return weatherData;

            // Current Weather
            JsonNode current = response.path("current");
            WeatherData.CurrentWeather currentWeather = new WeatherData.CurrentWeather();
            currentWeather.setTemperature(current.path("temperature_2m").asDouble());
            currentWeather.setHumidity(current.path("relative_humidity_2m").asDouble());
            currentWeather.setRealFeel(current.path("apparent_temperature").asDouble());
            currentWeather.setWindSpeed(current.path("wind_speed_10m").asDouble());
            currentWeather.setWindGust(current.path("wind_gusts_10m").asDouble());
            currentWeather.setPressure(current.path("pressure_msl").asDouble());
            currentWeather.setVisibility(current.path("visibility").asDouble());
            currentWeather.setUvIndex(current.path("uv_index").asDouble());
            weatherData.setCurrent(currentWeather);

            // 7-Day Forecast
            JsonNode daily = response.path("daily");
            List<WeatherData.DailyForecast> forecastList = new ArrayList<>();
            for (int i = 0; i < daily.path("time").size(); i++) {
                WeatherData.DailyForecast forecast = new WeatherData.DailyForecast();
                forecast.setDate(daily.path("time").get(i).asText());
                forecast.setMaxTemp(daily.path("temperature_2m_max").get(i).asDouble());
                forecast.setMinTemp(daily.path("temperature_2m_min").get(i).asDouble());
                forecast.setPrecipitationSum(daily.path("precipitation_sum").get(i).asDouble());
                forecast.setWindMax(daily.path("wind_speed_10m_max").get(i).asDouble());
                forecast.setUvMax(daily.path("uv_index_max").get(i).asDouble());
                forecastList.add(forecast);
            }
            weatherData.setSevenDayForecast(forecastList);
        } catch (Exception e) {
            System.err.println("Error fetching weather data: " + e.getMessage());
        }
        return weatherData;
    }
}