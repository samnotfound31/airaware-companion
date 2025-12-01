import { User, Mail, Calendar, AlertCircle, MapPin } from "lucide-react";

export default function UserProfile() {
  // TODO: fetch profile from /api/profile and populate fields

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
            <span className="text-muted-foreground italic">{"{{FIRST_NAME}} {{LAST_NAME}}"}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Email Address
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground italic">{"{{EMAIL}}"}</span>
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Age
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground italic">{"{{AGE}}"}</span>
          </div>
        </div>

        {/* Sensitivities */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            Health Sensitivities / Medical Notes
          </label>
          <div className="min-h-[100px] px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <span className="text-muted-foreground italic">{"{{SENSITIVITIES}}"}</span>
          </div>
        </div>

        {/* Preferred Location */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">
            Preferred Location (City)
          </label>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-secondary/50 border border-border/50">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground italic">{"{{PREFERRED_CITY}}"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
