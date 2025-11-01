import { CropRecommendation } from "@/components/CropRecommendation";
import { CropProfileCard } from "@/components/CropProfileCard";
import { CropDistributionChart } from "@/components/charts/CropDistributionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useData } from "@/contexts/DataContext";

const CropsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("all");

  const { getCropData } = useData();
  const cropData = getCropData();
  const cropRecommendation = {
    recommendationText: cropData.recommendationText!
  };
  const cropProfiles = cropData.profiles!;

  // Filter crops based on search and season
  const filteredCrops = cropProfiles.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.season.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = seasonFilter === "all" ||
      crop.season.toLowerCase().includes(seasonFilter.toLowerCase()) ||
      (seasonFilter === "multi" && crop.season.includes('/'));
    return matchesSearch && matchesSeason;
  });

  // Filter crops by season for tabs
  const kharifCrops = cropProfiles.filter(crop =>
    crop.season.toLowerCase().includes('kharif') || crop.season.includes('खरीफ')
  );
  const rabiCrops = cropProfiles.filter(crop =>
    crop.season.toLowerCase().includes('rabi') || crop.season.includes('रबी')
  );
  const allSeasonCrops = cropProfiles.filter(crop =>
    crop.season.includes('/') || crop.season.toLowerCase().includes('all')
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crop Management</h1>
        <Badge variant="success" className="flex items-center gap-1">
          <Sprout className="h-3 w-3" />
          {cropProfiles.length} Crops Available
        </Badge>
      </div>

      {/* Current Recommendation */}
      <CropRecommendation
        recommendationText={cropRecommendation.recommendationText}
        currentSeason="Rabi (Winter)"
      />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CropDistributionChart crops={cropProfiles} />

        <Card>
          <CardHeader>
            <CardTitle>Water Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['High', 'Moderate', 'Low'].map(level => {
                const count = cropProfiles.filter(crop => crop.water === level).length;
                const percentage = Math.round((count / cropProfiles.length) * 100);

                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${level === 'High' ? 'bg-accent' :
                          level === 'Moderate' ? 'bg-warning' : 'bg-success'
                        }`} />
                      <span className="text-sm font-medium">{level} Water</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{count} crops</span>
                      <Badge variant="outline" className="text-xs">{percentage}%</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Crop Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={seasonFilter} onValueChange={setSeasonFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="kharif">Kharif</SelectItem>
                <SelectItem value="rabi">Rabi</SelectItem>
                <SelectItem value="multi">Multi-season</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="grid">All Crops ({filteredCrops.length})</TabsTrigger>
              <TabsTrigger value="kharif">Kharif ({kharifCrops.length})</TabsTrigger>
              <TabsTrigger value="rabi">Rabi ({rabiCrops.length})</TabsTrigger>
              <TabsTrigger value="multi">Multi-season ({allSeasonCrops.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop, index) => (
                  <CropProfileCard key={index} crop={crop} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="kharif">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kharifCrops.map((crop, index) => (
                  <CropProfileCard key={index} crop={crop} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rabi">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rabiCrops.map((crop, index) => (
                  <CropProfileCard key={index} crop={crop} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="multi">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSeasonCrops.map((crop, index) => (
                  <CropProfileCard key={index} crop={crop} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CropsPage;