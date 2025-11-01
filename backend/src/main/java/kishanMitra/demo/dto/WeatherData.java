package kishanMitra.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class WeatherData {
    private CurrentWeather current;
    private List<DailyForecast> sevenDayForecast;

    @Data
    public static class CurrentWeather {
        private double temperature;
        private double humidity;
        private double windSpeed;
        private double realFeel;
        private double windGust;
        private double pressure;
        private double visibility;
        private double uvIndex;
    }

    @Data
    public static class DailyForecast {
        private String date;
        private double maxTemp;
        private double minTemp;
        private double precipitationSum;
        private double windMax;
        private double uvMax;
    }
}