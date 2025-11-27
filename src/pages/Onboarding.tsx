import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { MapPin, Heart, Bell, ChevronRight } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("San Francisco, CA");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [isSensitive, setIsSensitive] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleComplete = () => {
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("user_settings", JSON.stringify({
      location,
      ageGroup,
      isSensitive,
      enableNotifications
    }));
    window.location.href = "/static/dashboard.html";
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-aqi-good/20 via-background to-accent/10">
      <div className="w-full max-w-lg">
        <div className="glass-card rounded-3xl p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-accent">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-aqi-moderate flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-accent-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Let's get started</h2>
                <p className="text-muted-foreground">We'll personalize your air quality experience</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Location</Label>
                  <div className="p-4 rounded-2xl border border-border bg-secondary/50 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="font-medium">{location}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Location auto-detected. You can change this later.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Age Group</Label>
                  <RadioGroup value={ageGroup} onValueChange={setAgeGroup}>
                    <div className="flex items-center space-x-2 p-3 rounded-2xl border border-border hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="child" id="child" />
                      <Label htmlFor="child" className="flex-1 cursor-pointer">Child (0-12)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-2xl border border-border hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="teen" id="teen" />
                      <Label htmlFor="teen" className="flex-1 cursor-pointer">Teen (13-17)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-2xl border border-border hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="adult" id="adult" />
                      <Label htmlFor="adult" className="flex-1 cursor-pointer">Adult (18-64)</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-2xl border border-border hover:bg-secondary/50 transition-colors">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior" className="flex-1 cursor-pointer">Senior (65+)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-destructive/80 to-destructive flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Health sensitivity</h2>
                <p className="text-muted-foreground">Help us provide better recommendations</p>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl border border-border bg-secondary/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">I'm sensitive to air quality</h3>
                      <p className="text-sm text-muted-foreground">
                        Enable if you have asthma, heart conditions, or respiratory issues
                      </p>
                    </div>
                    <Switch 
                      checked={isSensitive} 
                      onCheckedChange={setIsSensitive}
                      className="mt-1"
                    />
                  </div>
                </div>

                {isSensitive && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 animate-slide-up">
                    <p className="text-sm text-destructive">
                      We'll provide more cautious recommendations and alert you to air quality changes sooner.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Notifications */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Stay informed</h2>
                <p className="text-muted-foreground">Get alerts when air quality changes</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Morning AQI Summary</h3>
                    <p className="text-sm text-muted-foreground">Daily briefing at 8:00 AM</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">AQI Threshold Alerts</h3>
                    <p className="text-sm text-muted-foreground">When air quality becomes unhealthy</p>
                  </div>
                  <Switch 
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                  />
                </div>

                <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Commute Alerts</h3>
                    <p className="text-sm text-muted-foreground">Before your usual travel times</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="rounded-2xl h-12 px-6"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 rounded-2xl h-12 text-base font-semibold bg-gradient-to-r from-accent to-aqi-moderate hover:opacity-90 transition-opacity"
            >
              {step === totalSteps ? "Get Started" : "Continue"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
