import { SoilDataCard } from "@/components/SoilDataCard";
import { SoilMetricsChart } from "@/components/charts/SoilMetricsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layers, TestTube, Droplets, Scale, TrendingUp } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const SoilPage = () => {
  const { getSoilData } = useData();
  const soilData = getSoilData();
  const soilHealthScore = soilData.soilHealthScore!;
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: "Excellent", color: "success" };
    if (score >= 60) return { status: "Good", color: "accent" };
    if (score >= 40) return { status: "Fair", color: "warning" };
    return { status: "Poor", color: "destructive" };
  };

  const healthStatus = getHealthStatus(soilHealthScore);

  // Soil recommendations based on current data
  const recommendations = [
    {
      category: "pH Management",
      status: "Optimal", 
      description: "Current pH level is within ideal range for most crops",
      action: "Maintain current soil management practices"
    },
    {
      category: "Organic Matter",
      status: "Good",
      description: "Organic carbon levels are adequate but can be improved",
      action: "Consider adding compost or organic fertilizers"
    },
    {
      category: "Moisture Content",
      status: "Moderate",
      description: "Soil moisture is adequate for current season",
      action: "Monitor irrigation scheduling for optimal water management"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Soil Analysis</h1>
        <Badge variant={healthStatus.color as any} className="flex items-center gap-1">
          <Layers className="h-3 w-3" />
          {healthStatus.status} Health
        </Badge>
      </div>

      {/* Soil Health Score */}
      <Card className="bg-gradient-to-br from-earth/20 to-success/10 border-earth/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Soil Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-earth">{soilHealthScore}/100</div>
            <Badge variant={healthStatus.color as any}>{healthStatus.status}</Badge>
          </div>
          <Progress value={soilHealthScore} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            Based on pH, organic matter, moisture, and nutrient analysis
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoilDataCard soilData={soilData} />
        <SoilMetricsChart soilData={soilData} />
      </div>

      {/* Detailed Soil Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Soil Type</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soilData.soilType}</div>
            <p className="text-xs text-muted-foreground">Primary composition</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">pH Level</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soilData.ph}</div>
            <p className="text-xs text-muted-foreground">
              {soilData.ph < 6.0 ? 'Acidic' : soilData.ph > 7.5 ? 'Alkaline' : 'Neutral'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soilData.topsoilMoisture}%</div>
            <p className="text-xs text-muted-foreground">Topsoil water content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bulk Density</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{soilData.bulkDensity}</div>
            <p className="text-xs text-muted-foreground">g/cm³</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Management Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{rec.category}</h3>
                  <Badge variant={rec.status === 'Optimal' ? 'success' as any : rec.status === 'Good' ? 'accent' as any : 'warning' as any}>
                    {rec.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                <p className="text-sm font-medium text-primary">{rec.action}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilPage;