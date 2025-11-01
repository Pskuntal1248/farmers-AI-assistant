import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { TrendingUp, BarChart3, Activity, Calendar, Droplets, Thermometer } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const AnalyticsPage = () => {
  const { getAnalyticsData } = useData();
  const analyticsData = getAnalyticsData();
  
  const soilHealthTrend = analyticsData.soilHealthTrend!;
  const weatherTrends = analyticsData.weatherTrends!;
  const cropYields = analyticsData.cropYields!;
  const monthlyMetrics = analyticsData.monthlyMetrics!;

  const chartConfig = {
    health: { label: "Soil Health", color: "hsl(var(--chart-1))" },
    ph: { label: "pH Level", color: "hsl(var(--chart-2))" },
    moisture: { label: "Moisture %", color: "hsl(var(--chart-3))" },
    avgTemp: { label: "Avg Temperature", color: "hsl(var(--chart-1))" },
    rainfall: { label: "Rainfall", color: "hsl(var(--chart-2))" },
    humidity: { label: "Humidity", color: "hsl(var(--chart-3))" },
    yield: { label: "Actual Yield", color: "hsl(var(--chart-1))" },
    target: { label: "Target Yield", color: "hsl(var(--chart-2))" },
    irrigation: { label: "Irrigation", color: "hsl(var(--chart-1))" },
    fertilizer: { label: "Fertilizer", color: "hsl(var(--chart-2))" },
    pesticide: { label: "Pesticide", color: "hsl(var(--chart-3))" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Farm Analytics</h1>
        <Badge variant="accent" className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          Historical Data Analysis
        </Badge>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/20 to-success/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Soil Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">78/100</div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-sky/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
            <Droplets className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">1,490L</div>
            <p className="text-xs text-muted-foreground">Per hectare this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/20 to-earth/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth">25.8°C</div>
            <p className="text-xs text-muted-foreground">6-month average</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/20 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">92%</div>
            <p className="text-xs text-muted-foreground">Yield vs target</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Soil Health Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Soil Health Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={soilHealthTrend}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="health"
                    stroke="var(--color-health)"
                    fill="var(--color-health)"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="moisture"
                    stroke="var(--color-moisture)"
                    fill="var(--color-moisture)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weather Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weather Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherTrends}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="avgTemp"
                    stroke="var(--color-avgTemp)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="rainfall"
                    stroke="var(--color-rainfall)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="var(--color-humidity)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Crop Yields Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Crop Yield Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropYields}>
                  <XAxis dataKey="crop" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="yield" fill="var(--color-yield)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Resource Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyMetrics}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="irrigation"
                    stackId="1"
                    stroke="var(--color-irrigation)"
                    fill="var(--color-irrigation)"
                  />
                  <Area
                    type="monotone"
                    dataKey="fertilizer"
                    stackId="1"
                    stroke="var(--color-fertilizer)"
                    fill="var(--color-fertilizer)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pesticide"
                    stackId="1"
                    stroke="var(--color-pesticide)"
                    fill="var(--color-pesticide)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-success">Best Performing Metrics</h3>
              <ul className="text-sm space-y-1">
                <li>• Rice yield exceeded target by 2.5%</li>
                <li>• Soil pH maintained optimal levels</li>
                <li>• Irrigation efficiency improved 15%</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-warning">Areas for Improvement</h3>
              <ul className="text-sm space-y-1">
                <li>• Cotton yield 10% below target</li>
                <li>• Pesticide usage increased 8%</li>
                <li>• Moisture levels need monitoring</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-accent">Recommendations</h3>
              <ul className="text-sm space-y-1">
                <li>• Implement drip irrigation system</li>
                <li>• Consider organic pest control methods</li>
                <li>• Plan crop rotation for next season</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;