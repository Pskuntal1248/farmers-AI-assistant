import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Sprout, TrendingUp, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/contexts/DataContext";
const Overview = () => {
  const { isLoading, error, refetch, getOverviewData } = useData();

  // Get overview-specific data using the new getter
  const overviewData = getOverviewData();
  
  // Process data for dashboard display with proper fallbacks
  const dashboardData = {
    district: overviewData?.district ?? "Delhi Region",
    state: overviewData?.state ?? "Delhi",
    currentSeason: overviewData?.currentSeason ?? "Current Season",
    groundwaterIndex: overviewData?.groundwaterIndex ?? 75.0,
    weatherData: {
      current: {
        temperature: overviewData?.temperature ?? 24.5,
        humidity: overviewData?.humidity ?? 65.0,
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading agricultural data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        district={dashboardData.district}
        state={dashboardData.state}
        currentSeason={dashboardData.currentSeason}
      />

      {/* API Status Indicator */}
      {overviewData && (
        <div className="text-right">
          <Badge variant="outline" className="text-xs">
            Live Data • Updated {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-sky/20 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-sky" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-sky">{dashboardData.weatherData.current.temperature}°C</div>
            <p className="text-xs text-muted-foreground">Current conditions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-sky/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{dashboardData.weatherData.current.humidity}%</div>
            <p className="text-xs text-muted-foreground">Air moisture</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groundwater</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardData.groundwaterIndex}</div>
            <Progress value={dashboardData.groundwaterIndex} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Index score</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/20 to-earth/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Season Status</CardTitle>
            <Sprout className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <Badge variant="success" className="mb-2">{dashboardData.currentSeason}</Badge>
            <p className="text-xs text-muted-foreground">Active growing season</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-medium mb-2">Weather Alert</h3>
              <p className="text-sm text-muted-foreground">
                {overviewData?.weatherAlert ?? 
                 "Optimal conditions for winter crop planting. Consider sowing wheat or chickpea this week."}
              </p>
            </div>
            
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <h3 className="font-medium mb-2">Soil Health</h3>
              <p className="text-sm text-muted-foreground">
                {overviewData?.soilHealthInfo ??
                 "pH levels are optimal for most crops. Moisture content is adequate for current season."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;