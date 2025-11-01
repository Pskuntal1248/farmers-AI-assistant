import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Waves, Droplets } from "lucide-react";

interface GroundwaterGaugeProps {
  groundwaterIndex: number;
}

export const GroundwaterGauge = ({ groundwaterIndex }: GroundwaterGaugeProps) => {
  const getWaterStatus = (index: number) => {
    if (index >= 80) return { status: "Excellent", color: "success", description: "Abundant water supply" };
    if (index >= 60) return { status: "Good", color: "accent", description: "Adequate water levels" };
    if (index >= 40) return { status: "Moderate", color: "warning", description: "Water conservation advised" };
    return { status: "Low", color: "destructive", description: "Water shortage concern" };
  };

  const waterStatus = getWaterStatus(groundwaterIndex);

  return (
    <Card className="bg-gradient-to-br from-accent/20 to-sky/10 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <Waves className="h-5 w-5" />
          Groundwater Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-accent">{groundwaterIndex}</div>
          <div className="text-sm text-muted-foreground">Index Score</div>
        </div>

        <div className="space-y-3">
          <Progress 
            value={groundwaterIndex} 
            className="h-3"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">0</span>
            <div className="flex items-center gap-2">
              <Droplets className={`h-4 w-4 ${
                waterStatus.color === 'success' ? 'text-success' :
                waterStatus.color === 'accent' ? 'text-accent' :
                waterStatus.color === 'warning' ? 'text-warning' : 'text-destructive'
              }`} />
              <span className="font-medium">{waterStatus.status}</span>
            </div>
            <span className="text-muted-foreground">100</span>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          {waterStatus.description}
        </div>
      </CardContent>
    </Card>
  );
};