import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, User, TrendingUp, Droplets, Wind, Eye, Gauge, Sun, Moon } from "lucide-react";
import ParticleCloud from "@/components/ParticleCloud";

type AQIBand = "good" | "moderate" | "unhealthy" | "veryUnhealthy" | "hazardous";

const Dashboard = () => {
  // Mock data - would come from API
  const [aqiData] = useState({
    value: 45,
    status: "Good" as const,
    band: "good" as AQIBand,
    trend: "Rising",
    station: "Downtown Monitor",
    updatedAt: "2 min ago",
    pm25: { value: 12.5, whoLimit: 25, percentage: 50 },
    pm10: { value: 28.3, whoLimit: 50, percentage: 57 },
  });

  const [weatherData] = useState({
    temp: 72,
    feelsLike: 68,
    humidity: 65,
    pressure: 1013,
    pressureTrend: "Stable",
    wind: { speed: 12, gust: 18, direction: "NW" },
    uv: 6,
    visibility: 10,
    sunrise: "6:42 AM",
    sunset: "7:23 PM",
  });

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

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out"
      style={{ background: getBackgroundGradient(aqiData.band) }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/30 border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-semibold">San Francisco, CA</span>
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
            <div className="aqi-number mb-2" style={{ color: getBandColor(aqiData.band) }}>
              {aqiData.value}
            </div>
            <h2 className="text-2xl font-bold mb-1">{aqiData.status}</h2>
            <p className="text-sm text-muted-foreground">
              Updated {aqiData.updatedAt} • Station: {aqiData.station}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium">
              Outdoor
            </span>
            <span className="px-4 py-1.5 rounded-full bg-secondary text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {aqiData.trend}
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
                <div className="text-3xl font-bold" style={{ color: getBandColor(aqiData.band) }}>
                  {aqiData.pm25.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">{aqiData.pm25.value} µg/m³</div>
              </div>
              <div className="h-32 rounded-2xl bg-secondary/50 overflow-hidden">
                <ParticleCloud 
                  density={aqiData.pm25.percentage / 100} 
                  color={getBandColor(aqiData.band)}
                />
              </div>
            </div>

            {/* PM10 */}
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">PM10</div>
                <div className="text-3xl font-bold" style={{ color: getBandColor(aqiData.band) }}>
                  {aqiData.pm10.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">{aqiData.pm10.value} µg/m³</div>
              </div>
              <div className="h-32 rounded-2xl bg-secondary/50 overflow-hidden">
                <ParticleCloud 
                  density={aqiData.pm10.percentage / 100}
                  color={getBandColor(aqiData.band)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weather Row */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-lg font-bold px-2">Weather</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
            {/* Temperature */}
            <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
              <div className="text-sm text-muted-foreground mb-2">Temperature</div>
              <div className="weather-value mb-1">{weatherData.temp}°</div>
              <div className="text-xs text-muted-foreground">Feels like {weatherData.feelsLike}°</div>
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
              <div className="text-2xl font-bold mb-1">{weatherData.wind.speed} mph</div>
              <div className="text-xs text-muted-foreground">Gust {weatherData.wind.gust} • {weatherData.wind.direction}</div>
            </div>

            {/* UV Index */}
            <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-4 h-4 text-yellow-400" />
                <div className="text-sm text-muted-foreground">UV Index</div>
              </div>
              <div className="weather-value">{weatherData.uv}</div>
              <div className="text-xs text-muted-foreground">Moderate</div>
            </div>

            {/* Visibility */}
            <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Visibility</div>
              </div>
              <div className="weather-value">{weatherData.visibility}</div>
              <div className="text-xs text-muted-foreground">miles</div>
            </div>

            {/* Pressure */}
            <div className="glass-card rounded-2xl p-4 min-w-[140px] snap-start">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">Pressure</div>
              </div>
              <div className="text-2xl font-bold mb-1">{weatherData.pressure}</div>
              <div className="text-xs text-muted-foreground">hPa • {weatherData.pressureTrend}</div>
            </div>
          </div>
        </div>

        {/* AI Concierge */}
        <div className="glass-card rounded-3xl p-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              AI
            </span>
            AI Concierge
          </h3>
          <p className="text-sm mb-4 leading-relaxed">
            Good morning! Air quality is excellent right now. Perfect conditions for outdoor activities. 
            Enjoy your day! 🌤️
          </p>
          <div className="flex gap-2 flex-wrap mb-4">
            <Button variant="outline" size="sm" className="rounded-full">Safe to run?</Button>
            <Button variant="outline" size="sm" className="rounded-full">Best commute time?</Button>
            <Button variant="outline" size="sm" className="rounded-full">Need a mask?</Button>
          </div>
          <Button className="w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
            Ask Agent
          </Button>
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
