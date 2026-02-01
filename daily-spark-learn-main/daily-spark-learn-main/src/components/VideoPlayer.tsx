import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  onComplete?: () => void;
  className?: string;
}

export function VideoPlayer({ videoId, onComplete, className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // For demo purposes, using a YouTube embed
  // In production, you'd use your own video hosting
  return (
    <div className={cn("relative rounded-2xl overflow-hidden shadow-lg bg-foreground/5", className)}>
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Learning Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onLoad={() => {
            // Simulate video completion after load
            // In production, you'd track actual video progress
          }}
        />
      </div>

      {/* Custom overlay for branding (optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: '0%' }} />
      </div>
    </div>
  );
}
