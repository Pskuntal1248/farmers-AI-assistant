import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Thermometer } from "lucide-react";

interface DashboardHeaderProps {
  district: string;
  state: string;
  currentSeason: string;
}

export const DashboardHeader = ({ district, state, currentSeason }: DashboardHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-success p-6 rounded-lg text-primary-foreground mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {district}
            </h1>
          </div>
          <div className="text-primary-foreground/80">
            {state}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {currentSeason}
          </Badge>
        </div>
      </div>
    </div>
  );
};