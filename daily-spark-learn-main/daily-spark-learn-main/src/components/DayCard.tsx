import { cn } from "@/lib/utils";
import { Check, Lock, Play } from "lucide-react";

type DayStatus = "completed" | "available" | "locked";

interface DayCardProps {
  day: number;
  title: string;
  status: DayStatus;
  onClick?: () => void;
  className?: string;
}

export function DayCard({ day, title, status, onClick, className }: DayCardProps) {
  const isClickable = status !== "locked";

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className={cn(
        "w-full p-6 rounded-2xl text-left",
        "border-2 shadow-card",
        "transition-all duration-200 ease-out",
        status === "completed" && "bg-success/10 border-success/30",
        status === "available" && "bg-card border-primary/20 hover:border-primary hover:translate-y-[-4px] hover:shadow-lg",
        status === "locked" && "bg-muted/50 border-muted cursor-not-allowed opacity-60",
        className
      )}
    >
      {/* Card Content */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Day Badge + Title */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "px-4 py-1 rounded-full text-sm font-semibold",
            status === "completed" && "bg-success text-success-foreground",
            status === "available" && "bg-primary text-primary-foreground",
            status === "locked" && "bg-muted-foreground/30 text-muted-foreground"
          )}>
            Day {day}
          </div>
          <h3 className={cn(
            "text-lg font-semibold",
            status === "locked" && "text-muted-foreground"
          )}>
            {title}
          </h3>
        </div>

        {/* Right: Status Icon */}
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
          status === "completed" && "bg-success text-success-foreground",
          status === "available" && "bg-primary/10 text-primary",
          status === "locked" && "bg-muted text-muted-foreground"
        )}>
          {status === "completed" && <Check className="w-6 h-6" />}
          {status === "available" && <Play className="w-6 h-6" />}
          {status === "locked" && <Lock className="w-5 h-5" />}
        </div>
      </div>

      {/* Status Text */}
      <div className="mt-4">
        {status === "available" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>시작 가능</span>
          </div>
        )}

        {status === "completed" && (
          <div className="flex items-center gap-2 text-sm text-success">
            <Check className="w-4 h-4" />
            <span>완료됨</span>
          </div>
        )}

        {status === "locked" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>이전 Day를 완료해주세요</span>
          </div>
        )}
      </div>
    </button>
  );
}
