import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, Layers, PieChart as PieChartIcon } from "lucide-react";

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

interface SoilMetricsChartProps {
  soilData: SoilData;
}

export const SoilMetricsChart = ({ soilData }: SoilMetricsChartProps) => {
  // Core properties chart data
  const corePropertiesData = [
    {
      metric: "pH",
      value: soilData.ph,
      optimal: 6.8,
      unit: "",
    },
    {
      metric: "Org. Carbon",
      value: soilData.soilOrganicCarbon,
      optimal: 10,
      unit: "g/kg",
    },
    {
      metric: "CEC",
      value: soilData.cationExchangeCapacity,
      optimal: 15,
      unit: "cmol/kg",
    },
    {
      metric: "Bulk Density",
      value: soilData.bulkDensity,
      optimal: 1.3,
      unit: "g/cm³",
    },
  ];

  // Nutrient levels data
  const nutrientData = [
    {
      metric: "Nitrogen",
      value: soilData.nitrogen,
      optimal: 30,
      unit: "kg/ha",
    },
    {
      metric: "Phosphorus",
      value: soilData.phosphorus,
      optimal: 35,
      unit: "kg/ha",
    },
    {
      metric: "Potassium",
      value: soilData.potassium,
      optimal: 200,
      unit: "kg/ha",
    },
  ];

  // Soil composition pie chart data
  const compositionData = [
    { name: 'Sand', value: soilData.sandPercent, color: '#F59E0B' },
    { name: 'Silt', value: soilData.siltPercent, color: '#8B5CF6' },
    { name: 'Clay', value: soilData.clayPercent, color: '#EF4444' },
  ];

  const chartConfig = {
    value: {
      label: "Current Value",
      color: "hsl(var(--chart-1))",
    },
    optimal: {
      label: "Optimal Range",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Core Soil Properties Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Core Properties vs Optimal
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={corePropertiesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis 
                  dataKey="metric" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-value)" 
                  radius={[4, 4, 0, 0]}
                  name="Current"
                />
                <Bar 
                  dataKey="optimal" 
                  fill="var(--color-optimal)" 
                  radius={[4, 4, 0, 0]}
                  opacity={0.6}
                  name="Optimal"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrient Levels Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              N-P-K Nutrients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutrientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="metric" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--chart-3))" 
                    radius={[4, 4, 0, 0]}
                    name="Current"
                  />
                  <Bar 
                    dataKey="optimal" 
                    fill="hsl(var(--chart-4))" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.6}
                    name="Optimal"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Soil Composition Pie Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Soil Composition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={compositionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {compositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">{data.value}% of soil composition</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
