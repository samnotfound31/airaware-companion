import { useMemo } from "react";

interface ParticleCloudProps {
  density: number; // 0-1
  color?: string;
  className?: string;
}

const ParticleCloud = ({ density, color = "hsl(var(--accent))", className = "" }: ParticleCloudProps) => {
  const particles = useMemo(() => {
    const count = Math.floor(density * 50) + 10;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 3,
      floatDistance: Math.random() * 20 + 10,
    }));
  }, [density]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-dot absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: 0.4 + density * 0.6,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            '--float-distance': `${particle.floatDistance}px`,
          } as React.CSSProperties & { '--float-distance': string }}
        />
      ))}
    </div>
  );
};

export default ParticleCloud;
