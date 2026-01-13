import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Settings, ArrowRight, Leaf, CheckCircle2, Loader2 } from "lucide-react";
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
    <div className="min-h-screen w-full bg-[#f8fafc] relative overflow-hidden">
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-white/80" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Leaf className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-green-50 text-green-700 border-green-200">
                Smart Agriculture Platform
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Kisaan Mitra</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Your intelligent farming companion for weather insights, soil analysis, and crop recommendations
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/25">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  Your Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Enable location access to receive personalized weather forecasts and region-specific agricultural recommendations.
                </p>
                
                <Button 
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25 transition-all duration-300"
                  data-testid="button-get-location"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-5 w-5" />
                      Detect My Location
                    </>
                  )}
                </Button>

                {location && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Coordinates</p>
                      <p className="font-semibold text-gray-900" data-testid="text-location">{location}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Language Preference Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/25">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  Language Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Select your preferred language for the dashboard interface and AI-powered recommendations.
                </p>
                
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full h-12 text-base border-gray-200 focus:ring-purple-500 focus:border-purple-500" data-testid="select-language">
                    <SelectValue placeholder="Choose your language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-base">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {language && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Selected Language</p>
                      <p className="font-semibold text-gray-900" data-testid="text-selected-language">
                        {languageOptions.find(opt => opt.value === language)?.label}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Card */}
          {(location || language) && (
            <Card className="bg-white/60 backdrop-blur-sm border-dashed border-2 border-gray-300 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Setup Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <MapPin className="h-4 w-4" />
                    <span>Location {location ? 'Set' : 'Required'}</span>
                    {location && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    language ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Globe className="h-4 w-4" />
                    <span>Language {language ? 'Set' : 'Required'}</span>
                    {language && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue to Dashboard Button */}
          <div className="text-center space-y-4">
            <Button 
              onClick={() => navigate('/overview')}
              disabled={!isSetupComplete}
              size="lg"
              className={`h-14 px-10 text-lg font-semibold shadow-xl transition-all duration-300 ${
                isSetupComplete 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30 hover:shadow-green-500/40 hover:scale-[1.02]' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              data-testid="button-continue-dashboard"
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              {isSetupComplete 
                ? "You're all set! Explore your personalized agricultural insights." 
                : "Please complete both steps above to continue."}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 pb-4">
            <p className="text-xs text-gray-400">
              Powered by AI | Real-time Data | Smart Recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;