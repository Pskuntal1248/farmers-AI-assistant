import { WeatherCard } from "@/components/WeatherCard";
import { TemperatureChart } from "@/components/charts/TemperatureChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Wind, Eye } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const WeatherPage = () => {
  const { getWeatherData } = useData();
  const weatherData = getWeatherData();
  const climateData = weatherData.climateData!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weather Analysis</h1>
        <Badge variant="accent" className="flex items-center gap-1">
          <CloudRain className="h-3 w-3" />
          Live Weather Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherCard weatherData={weatherData} />
        
        <div className="space-y-6">
          <TemperatureChart data={weatherData.sevenDayForecast} />
        </div>
      </div>

      {/* Detailed Weather Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-warning/20 to-earth/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UV Index</CardTitle>
            <Sun className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.current.uvIndex}</div>
            <p className="text-xs text-muted-foreground">
              {weatherData.current.uvIndex <= 2 ? 'Low' : 
               weatherData.current.uvIndex <= 5 ? 'Moderate' : 
               weatherData.current.uvIndex <= 7 ? 'High' : 'Very High'} exposure
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-sky/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.current.windSpeed}</div>
            <p className="text-xs text-muted-foreground">km/h</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-sky/20 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visibility</CardTitle>
            <Eye className="h-4 w-4 text-sky" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.current.visibility}</div>
            <p className="text-xs text-muted-foreground">km</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pressure</CardTitle>
            <CloudRain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherData.current.pressure}</div>
            <p className="text-xs text-muted-foreground">hPa</p>
          </CardContent>
        </Card>
      </div>

      {/* Climate Information */}
      <Card>
        <CardHeader>
          <CardTitle>Climate Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Average Temperature</h3>
              <div className="text-2xl font-bold text-primary">{climateData.averageTemperature}°C</div>
              <p className="text-sm text-muted-foreground">Annual average</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Annual Rainfall</h3>
              <div className="text-2xl font-bold text-accent">{climateData.annualRainfall}mm</div>
              <p className="text-sm text-muted-foreground">Total precipitation</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Climate Classification</h3>
              <Badge variant="secondary" className="text-sm">
                {climateData.koppenGeigerClassification}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">Köppen-Geiger system</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherPage;