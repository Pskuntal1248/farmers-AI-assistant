import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layers, TestTube, Droplets, Scale, Zap, Thermometer, Activity, Gauge } from "lucide-react";

interface SoilData {
  // Core soil properties
  ph: number;
  topsoilMoisture: number;
  subsoilMoisture: number;
  soilType: string;
  soilTemperature: number;
  
  // Soil composition and structure
  soilOrganicCarbon: number;
  cationExchangeCapacity: number;
  bulkDensity: number;
  sandPercent: number;
  siltPercent: number;
  clayPercent: number;
  
  // Nutrient levels (N-P-K)
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  
  // Soil chemistry
  electricalConductivity: number;
  salinity: number;
  
  // Health score (optional)
  soilHealthScore?: number;
}

interface SoilDataCardProps {
  soilData: SoilData;
}

export const SoilDataCard = ({ soilData }: SoilDataCardProps) => {
  const getPHStatus = (ph: number) => {
    if (ph < 6.0) return { status: "Acidic", color: "warning" };
    if (ph > 7.5) return { status: "Alkaline", color: "accent" };
    return { status: "Optimal", color: "success" };
  };

  const getMoistureLevel = (moisture: number) => {
    if (moisture === 0) return "Dry";
    if (moisture < 15) return "Low";
    if (moisture < 25) return "Moderate"; 
    return "High";
  };

  const getNutrientStatus = (value: number, type: 'N' | 'P' | 'K') => {
    const thresholds = {
      N: { low: 20, high: 40 },
      P: { low: 25, high: 50 },
      K: { low: 150, high: 300 }
    };
    
    const thresh = thresholds[type];
    if (value < thresh.low) return { status: "Low", color: "destructive" };
    if (value > thresh.high) return { status: "High", color: "success" };
    return { status: "Moderate", color: "warning" };
  };

  const phStatus = getPHStatus(soilData.ph);

  return (
    <div className="space-y-6">
      {/* Main Soil Analysis Card */}
      <Card className="bg-gradient-to-br from-earth/20 to-secondary/30 border-earth/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-earth-foreground">
            <Layers className="h-5 w-5" />
            Comprehensive Soil Analysis
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{soilData.soilType}</Badge>
            <Badge variant="outline">
              <Thermometer className="h-3 w-3 mr-1" />
              {soilData.soilTemperature}°C
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* pH Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">pH Level</span>
                </div>
                <Badge variant={phStatus.color === "success" ? "default" : "secondary"}>
                  {phStatus.status}
                </Badge>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.ph}</span>
                <span className="text-sm text-muted-foreground pb-1">pH</span>
              </div>
              <Progress value={(soilData.ph / 14) * 100} className="h-2" />
            </div>

            {/* Topsoil Moisture */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Topsoil Moisture</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.topsoilMoisture}</span>
                <span className="text-sm text-muted-foreground pb-1">%</span>
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                {getMoistureLevel(soilData.topsoilMoisture)}
              </Badge>
            </div>

            {/* Subsoil Moisture */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Subsoil Moisture</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.subsoilMoisture}</span>
                <span className="text-sm text-muted-foreground pb-1">%</span>
              </div>
              <Badge variant="outline" className="text-xs w-fit">
                {getMoistureLevel(soilData.subsoilMoisture)}
              </Badge>
            </div>

            {/* Organic Carbon */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Organic Carbon</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.soilOrganicCarbon}</span>
                <span className="text-sm text-muted-foreground pb-1">g/kg</span>
              </div>
            </div>

            {/* Bulk Density */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Bulk Density</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.bulkDensity}</span>
                <span className="text-sm text-muted-foreground pb-1">g/cm³</span>
              </div>
            </div>

            {/* CEC */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">CEC</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{soilData.cationExchangeCapacity}</span>
                <span className="text-sm text-muted-foreground pb-1">cmol/kg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrient Levels Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="h-5 w-5" />
            Nutrient Levels (N-P-K)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nitrogen */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nitrogen (N)</span>
                <Badge variant={getNutrientStatus(soilData.nitrogen, 'N').color as any}>
                  {getNutrientStatus(soilData.nitrogen, 'N').status}
                </Badge>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-green-700">{soilData.nitrogen}</span>
                <span className="text-sm text-muted-foreground pb-1">kg/ha</span>
              </div>
              <Progress value={(soilData.nitrogen / 60) * 100} className="h-2" />
            </div>

            {/* Phosphorus */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Phosphorus (P)</span>
                <Badge variant={getNutrientStatus(soilData.phosphorus, 'P').color as any}>
                  {getNutrientStatus(soilData.phosphorus, 'P').status}
                </Badge>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-orange-600">{soilData.phosphorus}</span>
                <span className="text-sm text-muted-foreground pb-1">kg/ha</span>
              </div>
              <Progress value={(soilData.phosphorus / 80) * 100} className="h-2" />
            </div>

            {/* Potassium */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Potassium (K)</span>
                <Badge variant={getNutrientStatus(soilData.potassium, 'K').color as any}>
                  {getNutrientStatus(soilData.potassium, 'K').status}
                </Badge>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-purple-600">{soilData.potassium}</span>
                <span className="text-sm text-muted-foreground pb-1">kg/ha</span>
              </div>
              <Progress value={(soilData.potassium / 400) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soil Composition & Chemistry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Composition */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Layers className="h-5 w-5" />
              Soil Composition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sand */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sand</span>
                <span className="text-sm text-muted-foreground">{soilData.sandPercent}%</span>
              </div>
              <Progress value={soilData.sandPercent} className="h-2" />
            </div>
            
            {/* Silt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Silt</span>
                <span className="text-sm text-muted-foreground">{soilData.siltPercent}%</span>
              </div>
              <Progress value={soilData.siltPercent} className="h-2" />
            </div>
            
            {/* Clay */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clay</span>
                <span className="text-sm text-muted-foreground">{soilData.clayPercent}%</span>
              </div>
              <Progress value={soilData.clayPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Soil Chemistry */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Gauge className="h-5 w-5" />
              Soil Chemistry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Electrical Conductivity */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Electrical Conductivity</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{soilData.electricalConductivity}</span>
                <span className="text-xs text-muted-foreground ml-1">dS/m</span>
              </div>
            </div>
            
            {/* Salinity */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Salinity</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">{soilData.salinity}</span>
                <span className="text-xs text-muted-foreground ml-1">ppt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
