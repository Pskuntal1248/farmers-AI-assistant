import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sprout } from "lucide-react";

interface CropRecommendationProps {
  recommendationText: string;
  currentSeason: string;
}

export const CropRecommendation = ({ recommendationText, currentSeason }: CropRecommendationProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary/20 to-success/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <Lightbulb className="h-5 w-5" />
            Crop Recommendation
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sprout className="h-3 w-3" />
            {currentSeason}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm leading-relaxed text-foreground/90">
            {recommendationText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};