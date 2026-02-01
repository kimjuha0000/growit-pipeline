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
        "relative w-full p-6 rounded-2xl transition-all duration-300 text-left group",
        "border-2 shadow-card",
        status === "completed" && "bg-success/10 border-success/30 hover:shadow-card-hover",
        status === "available" && "bg-card border-primary/20 hover:border-primary hover:shadow-card-hover hover:-translate-y-1",
        status === "locked" && "bg-muted/50 border-muted cursor-not-allowed opacity-60",
        className
      )}
    >
      {/* Day Badge */}
      <div className={cn(
        "absolute -top-3 left-6 px-4 py-1 rounded-full text-sm font-semibold",
        status === "completed" && "bg-success text-success-foreground",
        status === "available" && "bg-primary text-primary-foreground",
        status === "locked" && "bg-muted-foreground/30 text-muted-foreground"
      )}>
        Day {day}
      </div>

      <div className="flex items-center justify-between mt-2">
        <h3 className={cn(
          "text-lg font-semibold pr-4",
          status === "locked" && "text-muted-foreground"
        )}>
          {title}
        </h3>

        {/* Status Icon */}
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          status === "completed" && "bg-success text-success-foreground",
          status === "available" && "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
          status === "locked" && "bg-muted text-muted-foreground"
        )}>
          {status === "completed" && <Check className="w-6 h-6" />}
          {status === "available" && <Play className="w-6 h-6" />}
          {status === "locked" && <Lock className="w-5 h-5" />}
        </div>
      </div>

      {/* Progress Indicator for available */}
      {status === "available" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>시작 가능</span>
        </div>
      )}

      {status === "completed" && (
        <div className="mt-4 flex items-center gap-2 text-sm text-success">
          <Check className="w-4 h-4" />
          <span>완료됨</span>
        </div>
      )}
    </button>
  );
}
