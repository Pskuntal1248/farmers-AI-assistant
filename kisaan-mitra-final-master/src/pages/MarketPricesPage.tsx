import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  IndianRupee, TrendingUp, TrendingDown, Minus, RefreshCw, Loader2, 
  AlertCircle, BarChart3, Calendar, MapPin, Package, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MarketPrice {
  serialNo: string;
  market: string;
  commodity: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
  state: string;
}

interface MarketData {
  success: boolean;
  prices: MarketPrice[];
  count: number;
  commodities: string[];
  states: string[];
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const MarketPricesPage = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("Delhi");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchMarketPrices = async (state: string, commodity?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_BASE_URL}/api/market-prices?state=${encodeURIComponent(state)}`;
      if (commodity && commodity !== "all") {
        url += `&commodity=${encodeURIComponent(commodity)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMarketData(data);
      } else {
        setError(data.error || "Failed to fetch market prices");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
      console.error("Error fetching market prices:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices(selectedState);
  }, []);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCommodity("all");
    fetchMarketPrices(state);
  };

  const handleCommodityChange = (commodity: string) => {
    setSelectedCommodity(commodity);
    fetchMarketPrices(selectedState, commodity === "all" ? undefined : commodity);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMarketPrices(selectedState, selectedCommodity === "all" ? undefined : selectedCommodity);
  };

  const getPriceTrend = (prices: MarketPrice[], commodity: string) => {
    const commodityPrices = prices.filter(p => p.commodity === commodity);
    if (commodityPrices.length < 2) return "stable";
    const latest = commodityPrices[0].modalPrice;
    const previous = commodityPrices[1].modalPrice;
    if (latest > previous * 1.02) return "up";
    if (latest < previous * 0.98) return "down";
    return "stable";
  };

  const getUniqueCommodities = () => {
    if (!marketData?.prices) return [];
    const commodities = [...new Set(marketData.prices.map(p => p.commodity))];
    return commodities.sort();
  };

  const getLatestPrices = () => {
    if (!marketData?.prices) return [];
    const latestPrices: { [key: string]: MarketPrice } = {};
    marketData.prices.forEach(price => {
      if (!latestPrices[price.commodity] || 
          new Date(price.date) > new Date(latestPrices[price.commodity].date)) {
        latestPrices[price.commodity] = price;
      }
    });
    return Object.values(latestPrices);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUpRight className="h-4 w-4" />;
      case "down": return <ArrowDownRight className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-red-600 bg-red-50 border-red-200";
      case "down": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading && !marketData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Loading market prices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <IndianRupee className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
              <p className="text-sm text-muted-foreground">Real-time mandi prices from AgMarknet</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedState} onValueChange={handleStateChange}>
            <SelectTrigger className="w-[200px] bg-white">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {(marketData?.states || []).map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCommodity} onValueChange={handleCommodityChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="All Commodities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Commodities</SelectItem>
              {getUniqueCommodities().map(commodity => (
                <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Commodities</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{getUniqueCommodities().length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Records</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{marketData?.count || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">State</p>
                <p className="text-lg font-bold text-gray-900 mt-1 truncate">{selectedState}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Updated</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="cards" className="gap-2">
            <Package className="h-4 w-4" />
            Price Cards
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Table
          </TabsTrigger>
        </TabsList>

        {/* Price Cards View */}
        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getLatestPrices().map((price, index) => {
              const trend = getPriceTrend(marketData?.prices || [], price.commodity);
              return (
                <Card key={`${price.commodity}-${index}`} className="bg-white hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className={`h-1 ${trend === 'up' ? 'bg-red-500' : trend === 'down' ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold">{price.commodity}</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {price.market}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${getTrendColor(trend)}`}
                      >
                        {getTrendIcon(trend)}
                        <span className="ml-1">{trend === "up" ? "Up" : trend === "down" ? "Down" : "Stable"}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(price.modalPrice)}</span>
                        <span className="text-xs text-muted-foreground">/qtl</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3 text-green-600" />
                          {formatPrice(price.minPrice)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-red-600" />
                          {formatPrice(price.maxPrice)}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {price.date}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Price Table View */}
        <TabsContent value="table">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Price History</CardTitle>
              <CardDescription>
                Detailed market prices from {selectedState} - Last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Commodity</TableHead>
                      <TableHead className="font-semibold">Market</TableHead>
                      <TableHead className="text-right font-semibold">Min</TableHead>
                      <TableHead className="text-right font-semibold">Max</TableHead>
                      <TableHead className="text-right font-semibold">Modal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(selectedCommodity === "all" 
                      ? marketData?.prices?.slice(0, 50) 
                      : marketData?.prices?.filter(p => p.commodity === selectedCommodity)
                    )?.map((price, index) => (
                      <TableRow key={`${price.commodity}-${price.date}-${index}`} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-muted-foreground">{price.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">{price.commodity}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{price.market}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">{formatPrice(price.minPrice)}</TableCell>
                        <TableCell className="text-right text-red-600 font-medium">{formatPrice(price.maxPrice)}</TableCell>
                        <TableCell className="text-right font-bold">{formatPrice(price.modalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {marketData?.prices && marketData.prices.length > 50 && selectedCommodity === "all" && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Showing first 50 records. Select a specific commodity to see all data.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Footer */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center flex-shrink-0">
              <IndianRupee className="h-5 w-5 text-gray-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-900">About Market Prices</p>
              <p className="text-xs text-muted-foreground">
                Data sourced from AgMarknet (Agricultural Marketing Information Network), Government of India. 
                All prices in INR per quintal (100 kg). Modal price indicates most common market price.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPricesPage;
