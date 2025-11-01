import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Settings, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SetupPage = () => {
  const [location, setLocation] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [language, setLanguage] = useState<string>("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const navigate = useNavigate();

  const isSetupComplete = location && language;

  // Load saved preferences on component mount
  useEffect(() => {
    const saved = localStorage.getItem('kisaan-mitra-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.latitude && parsed.longitude) {
          setLocation(`${parsed.latitude.toFixed(4)}, ${parsed.longitude.toFixed(4)}`);
          setCoordinates({ latitude: parsed.latitude, longitude: parsed.longitude });
        }
        if (parsed.language) {
          setLanguage(parsed.language);
        }
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (coordinates && language) {
      const preferences = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        language: language
      };
      localStorage.setItem('kisaan-mitra-preferences', JSON.stringify(preferences));
      console.log('Saved user preferences:', preferences);
    }
  }, [coordinates, language]);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setCoordinates({ latitude, longitude });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location access denied");
          setIsGettingLocation(false);
        }
      );
    } else {
      setLocation("Geolocation not supported");
      setIsGettingLocation(false);
    }
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी (Hindi)" },
    { value: "bn", label: "বাংলা (Bengali)" },
    { value: "te", label: "తెలుగు (Telugu)" },
    { value: "ta", label: "தமிழ் (Tamil)" },
    { value: "mr", label: "मराठी (Marathi)" },
    { value: "gu", label: "ગુજરાતી (Gujarati)" },
    { value: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { value: "or", label: "ଓଡ଼ିଆ (Odia)" },
    { value: "pa", label: "ਪੰਜਾਬੀ (Punjabi)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
              Setup
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Kisaan Mitra</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's personalize your agricultural dashboard experience
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Allow access to your location to get personalized weather data and local agricultural recommendations.
              </p>
              
              <Button 
                onClick={handleGetLocation}
                disabled={isGettingLocation}
                className="w-full h-12 text-base font-medium"
                data-testid="button-get-location"
              >
                {isGettingLocation ? "Getting Location..." : "Get My Location"}
              </Button>

              {location && (
                <div className="p-4 bg-background/70 rounded-xl border border-primary/10">
                  <p className="font-medium text-primary" data-testid="text-location">
                    📍 Location: {location}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Language Preference Card */}
          <Card className="bg-gradient-to-br from-accent/10 to-success/5 border-accent/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                Language Preference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Choose your preferred language for the agricultural dashboard interface.
              </p>
              
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full h-12 text-base" data-testid="select-language">
                  <SelectValue placeholder="Select your language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {language && (
                <div className="p-4 bg-background/70 rounded-xl border border-accent/10">
                  <p className="font-medium text-accent" data-testid="text-selected-language">
                    🌐 Selected: {languageOptions.find(opt => opt.value === language)?.label}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        {(location || language) && (
          <Card className="border-dashed border-2 border-muted-foreground/20 bg-muted/20 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setup Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {location && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium" data-testid="summary-location">Location: {location}</span>
                </div>
              )}
              {language && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Globe className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="font-medium" data-testid="summary-language">
                    Language: {languageOptions.find(opt => opt.value === language)?.label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Continue to Dashboard Button */}
        {isSetupComplete && (
          <div className="text-center">
            <Button 
              onClick={() => navigate('/overview')}
              size="lg"
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
              data-testid="button-continue-dashboard"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              You're all set! Let's explore your personalized agricultural dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupPage;