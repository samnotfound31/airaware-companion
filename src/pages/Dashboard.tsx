import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, User, TrendingUp, Droplets, Wind, Eye, Gauge, Sun } from "lucide-react";
import ParticleCloud from "@/components/ParticleCloud";
import { useLocation, useAQIData, useWeatherData } from "@/hooks/useAQIData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AIChat from "@/components/AIChat";
import UserProfile from "@/components/UserProfile";

type AQIBand = "good" | "moderate" | "unhealthy" | "veryUnhealthy" | "hazardous";

const Dashboard = () => {
  // Get user's location
  const { data: location, isLoading: locationLoading, error: locationError } = useLocation();
  
  // Fetch AQI and weather data
  const { data: aqiData, isLoading: aqiLoading, error: aqiError } = useAQIData(location?.lat, location?.lon);
  const { data: weatherData, isLoading: weatherLoading } = useWeatherData(location?.lat, location?.lon);

  const [userCity, setUserCity] = useState("Loading...");

  useEffect(() => {
    if (aqiData?.location) {
      setUserCity(aqiData.location);
    }
  }, [aqiData]);

  // Helper function to determine AQI band
  const getAQIBand = (aqi: number): AQIBand => {
    if (aqi <= 50) return "good";
    if (aqi <= 100) return "moderate";
    if (aqi <= 150) return "unhealthy";
    if (aqi <= 200) return "veryUnhealthy";
    return "hazardous";
  };

  // Helper function to get status text
  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const currentAQI = aqiData?.aqi || 0;
  const pm25 = aqiData?.pm25 || 0;
  const pm10 = aqiData?.pm10 || 0;
  const band = getAQIBand(currentAQI);
  const status = getAQIStatus(currentAQI);

  const getBandColor = (band: AQIBand) => {
    const colors = {
      good: "hsl(var(--aqi-good))",
      moderate: "hsl(var(--aqi-moderate))",
      unhealthy: "hsl(var(--aqi-unhealthy))",
      veryUnhealthy: "hsl(var(--aqi-very-unhealthy))",
      hazardous: "hsl(var(--aqi-hazardous))",
    };
    return colors[band];
  };

  const getBackgroundGradient = (band: AQIBand) => {
    const gradients = {
      good: "var(--gradient-aqi-good)",
      moderate: "var(--gradient-aqi-moderate)",
      unhealthy: "var(--gradient-aqi-unhealthy)",
      veryUnhealthy: "var(--gradient-aqi-very-unhealthy)",
      hazardous: "var(--gradient-aqi-hazardous)",
    };
    return gradients[band];
  };

  // Loading state
  if (locationLoading || aqiLoading) {
    return (
      <div 
        className="min-h-screen transition-all duration-700 ease-in-out"
        style={{ background: getBackgroundGradient("good") }}
      >
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/30 border-b border-border/30">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </main>
      </div>
    );
  }

  // Error state
  if (locationError || aqiError) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: getBackgroundGradient("good") }}
      >
        <div className="max-w-md">
          <Alert variant="destructive" className="glass-card">
            <AlertDescription>
              {locationError ? 
                "Unable to access your location. Please enable location services." : 
                "Unable to fetch air quality data. Please try again later."}
            </AlertDescription>
            <Button 
              className="mt-4 w-full" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out"
      style={{ background: getBackgroundGradient(band) }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/30 border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-semibold">{userCity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Hero AQI */}
        <div className="glass-card rounded-3xl p-8 text-center animate-slide-up">
          <div className="mb-4">
            <div className="aqi-number mb-2" style={{ color: getBandColor(band) }}>
              {currentAQI}
            </div>
            <h2 className="text-2xl font-bold mb-1">{status}</h2>
            <p className="text-sm text-muted-foreground">
              Updated {aqiData?.timestamp ? new Date(aqiData.timestamp).toLocaleTimeString() : 'recently'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium">
              Outdoor
            </span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Live
            </span>
          </div>
        </div>

        {/* Particulates */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-bold mb-4">Particulates</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* PM2.5 */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">PM2.5</div>
                <div className="text-3xl font-bold" style={{ color: getBandColor(band) }}>
                  {pm25.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">µg/m³</div>
              </div>
              <div className="h-32 rounded-2xl bg-secondary/50 overflow-hidden">
                <ParticleCloud 
                  density={Math.min(pm25 / 100, 1)} 
                  color={getBandColor(band)}
                />
              </div>
            </div>

            {/* PM10 */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">PM10</div>
                <div className="text-3xl font-bold" style={{ color: getBandColor(band) }}>
                  {pm10.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">µg/m³</div>
              </div>
              <div className="h-32 rounded-2xl bg-secondary/50 overflow-hidden">
                <ParticleCloud 
                  density={Math.min(pm10 / 150, 1)}
                  color={getBandColor(band)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weather Row */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-bold px-2">Weather</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
            {weatherLoading ? (
              Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="min-w-[140px] h-24 rounded-2xl" />
              ))
            ) : weatherData ? (
              <>
                {/* Temperature */}
                <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
                  <div className="text-sm text-muted-foreground mb-2">Temperature</div>
                  <div className="weather-value mb-1">{Math.round(weatherData.temp)}°</div>
                  <div className="text-xs text-muted-foreground">Feels like {Math.round(weatherData.feelsLike)}°</div>
                </div>

                {/* Humidity */}
                <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <div className="text-sm text-muted-foreground">Humidity</div>
                  </div>
                  <div className="weather-value">{weatherData.humidity}%</div>
                </div>

                {/* Wind */}
                <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="w-4 h-4 text-accent" />
                    <div className="text-sm text-muted-foreground">Wind</div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{Math.round(weatherData.windSpeed)} mph</div>
                </div>

                {/* Description */}
                <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm text-muted-foreground">Condition</div>
                  </div>
                  <div className="text-2xl mb-1">{weatherData.icon}</div>
                  <div className="text-xs text-muted-foreground">{weatherData.description}</div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* AI Chat Window */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <AIChat />
        </div>

        {/* User Profile */}
        <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <UserProfile />
        </div>

        {/* Bottom spacing for navigation */}
        <div className="h-24" />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-background/80 border-t border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-around">
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <Wind className="w-5 h-5 text-accent" />
            <span className="text-xs font-medium">Home</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs">Insights</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <MapPin className="w-5 h-5" />
            <span className="text-xs">Routes</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <Gauge className="w-5 h-5" />
            <span className="text-xs">Devices</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>

      {/* Floating Chat Launcher */}
      <AIChat isFloating />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
