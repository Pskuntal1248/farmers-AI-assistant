import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Clock, Droplets, TestTube, Leaf } from "lucide-react";

interface CropProfile {
  name: string;
  season: string;
  soil: string;
  duration: string;
  ph: string;
  water: string;
  notes: string;
}

interface CropProfileCardProps {
  crop: CropProfile;
}

export const CropProfileCard = ({ crop }: CropProfileCardProps) => {
  const getWaterColor = (waterLevel: string) => {
    const level = waterLevel.toLowerCase();
    if (level.includes('high') || level.includes('very high')) return 'accent';
    if (level.includes('moderate')) return 'warning';
    if (level.includes('low') || level.includes('very low')) return 'success';
    return 'secondary';
  };

  const getSeasonColor = (season: string) => {
    const s = season.toLowerCase();
    if (s.includes('kharif') || s.includes('खरीफ')) return 'success';
    if (s.includes('rabi') || s.includes('आधा') || s.includes('रबी')) return 'earth';
    if (s.includes('zaid') || s.includes('ज़ैद')) return 'warning';
    return 'secondary';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-success" />
            <span className="text-lg">{crop.name}</span>
          </div>
          <Badge variant={getSeasonColor(crop.season)}>
            {crop.season}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">Duration</span>
            </div>
            <div className="font-medium">{crop.duration}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TestTube className="h-3 w-3" />
              <span className="text-xs">pH Range</span>
            </div>
            <div className="font-medium">{crop.ph}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-accent" />
            <Badge variant={getWaterColor(crop.water)} className="text-xs">
              {crop.water} Water
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Leaf className="h-3 w-3" />
            <span className="text-xs">Soil Requirements</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {crop.soil}
          </p>
        </div>

        {crop.notes && (
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {crop.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};