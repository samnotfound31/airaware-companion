import { User, Mail, Calendar, AlertCircle, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
  // TODO: fetch profile from /api/profile and populate fields
  // Example API call:
  // useEffect(() => {
  //   fetch('/api/profile', {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //   .then(res => res.json())
  //   .then(data => {
  //     setFirstName(data.firstName);
  //     setLastName(data.lastName);
  //     setEmail(data.email);
  //     setAge(data.age);
  //     setSensitivities(data.sensitivities);
  //     setPreferredCity(data.preferredCity);
  //   });
  // }, []);

  return (
    <div className="glass-card rounded-3xl p-6 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3 pb-4 border-b border-border/50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">User Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your information</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Full Name
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {/* TODO: Insert name fetch here */}
              <span className="text-muted-foreground italic">{"{{FIRST_NAME}} {{LAST_NAME}}"}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-2">
            💡 Developer: Fetch from backend and replace placeholder
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Email Address
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {/* TODO: Insert email fetch here */}
              <span className="text-muted-foreground italic">{"{{EMAIL}}"}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-2">
            💡 Developer: Fetch from backend and replace placeholder
          </p>
        </div>

        {/* Age */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Age
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {/* TODO: Insert age fetch here */}
              <span className="text-muted-foreground italic">{"{{AGE}}"}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-2">
            💡 Developer: Fetch from backend and replace placeholder
          </p>
        </div>

        {/* Sensitivities */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Health Sensitivities / Medical Notes
          </label>
          <Textarea
            placeholder="e.g., Asthma, seasonal allergies, etc..."
            className="min-h-[100px] rounded-2xl"
            disabled
            value=""
          />
          <p className="text-xs text-muted-foreground mt-1 pl-2">
            💡 Developer: Replace with actual textarea that saves to backend
          </p>
        </div>

        {/* Preferred Location */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Preferred Location (City)
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">
              {/* TODO: Insert preferred city fetch here */}
              <span className="text-muted-foreground italic">{"{{PREFERRED_CITY}}"}</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-2">
            💡 Developer: Fetch from backend and replace placeholder
          </p>
        </div>

        <div className="pt-4">
          <Button className="w-full rounded-2xl" disabled>
            Save Changes
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Connect to backend API endpoint to enable editing
          </p>
        </div>
      </div>
    </div>
  );
}
