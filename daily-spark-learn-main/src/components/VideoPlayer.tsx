import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  onComplete?: () => void;
  className?: string;
}

export function VideoPlayer({ videoId, onComplete, className }: VideoPlayerProps) {
  return (
    <div className={cn("rounded-2xl overflow-hidden border border-border bg-muted/50", className)}>
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Learning Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
