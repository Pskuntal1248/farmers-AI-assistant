import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Wind, Eye, Gauge, Umbrella, Calendar } from "lucide-react";

interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    realFeel: number;
    windGust: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  sevenDayForecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitationSum: number;
    windMax: number;
    uvMax: number;
  }>;
}

interface WeatherCardProps {
  weatherData: WeatherData;
}

export const WeatherCard = ({ weatherData }: WeatherCardProps) => {
  const { current, sevenDayForecast } = weatherData;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      <Card className="bg-gradient-to-br from-sky/20 to-accent/10 border-sky/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-foreground">
            <Thermometer className="h-5 w-5" />
            Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-sky">{current.temperature}°C</div>
            <div className="text-right text-muted-foreground">
              <div>Feels like {current.realFeel}°C</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-accent" />
              <span className="text-sm">{current.humidity}% humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{current.windSpeed} km/h wind</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            7-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sevenDayForecast.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="font-medium min-w-20">
                    {index === 0 ? 'Today' : formatDate(day.date)}
                  </div>
                  {day.precipitationSum > 0 && (
                    <div className="flex items-center gap-1 text-accent">
                      <Umbrella className="h-3 w-3" />
                      <span className="text-xs">{day.precipitationSum}mm</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">{day.maxTemp}°</span>
                  <span className="text-muted-foreground">{day.minTemp}°</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};