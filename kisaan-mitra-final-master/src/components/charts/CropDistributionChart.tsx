import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon, Sprout } from "lucide-react";

interface CropProfile {
  name: string;
  season: string;
  water: string;
}

interface CropDistributionChartProps {
  crops: CropProfile[];
}

export const CropDistributionChart = ({ crops }: CropDistributionChartProps) => {
  // Group crops by season
  const seasonData = crops.reduce((acc, crop) => {
    const season = crop.season.includes('/') ? 'Multi-season' : crop.season;
    acc[season] = (acc[season] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(seasonData).map(([season, count]) => ({
    season,
    count,
    percentage: Math.round((count / crops.length) * 100),
  }));

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const chartConfig = chartData.reduce((config, item, index) => {
    config[item.season] = {
      label: item.season,
      color: COLORS[index % COLORS.length],
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Crops by Season
        </CardTitle>
        <Sprout className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ season, percentage }) => `${season}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `Season: ${value}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};