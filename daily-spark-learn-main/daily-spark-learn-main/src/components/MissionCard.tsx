import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: string;
  hint?: string;
  onComplete: () => void;
  className?: string;
}

export function MissionCard({ mission, hint, onComplete, className }: MissionCardProps) {
  const [userInput, setUserInput] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const canComplete = userInput.trim().length > 0;

  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 md:p-8 shadow-card border-2 border-primary/20 transition-all duration-300",
      isCompleted && "border-success/50 bg-success/5",
      className
    )}>
      {/* Mission Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
          isCompleted ? "bg-success/20" : "bg-primary/10"
        )}>
          {isCompleted ? (
            <Check className="w-6 h-6 text-success animate-scale-in" />
          ) : (
            <Lightbulb className="w-6 h-6 text-primary" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">오늘의 미션</h3>
          <p className="text-muted-foreground">{mission}</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="여기에 답변을 작성해주세요..."
          disabled={isCompleted}
          className={cn(
            "w-full p-4 rounded-xl border-2 border-border bg-background resize-none h-32 transition-all duration-200",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "placeholder:text-muted-foreground/50",
            isCompleted && "opacity-60 cursor-not-allowed"
          )}
        />
      </div>

      {/* Hint Section */}
      {hint && !isCompleted && (
        <div className="mb-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            💡 {showHint ? "힌트 숨기기" : "힌트 보기"}
          </button>
          {showHint && (
            <p className="mt-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg animate-fade-in">
              {hint}
            </p>
          )}
        </div>
      )}

      {/* Complete Button */}
      <Button
        variant={isCompleted ? "success" : "default"}
        size="lg"
        onClick={handleComplete}
        disabled={!canComplete || isCompleted}
        className="w-full"
      >
        {isCompleted ? (
          <>
            <Check className="w-5 h-5" />
            완료됨
          </>
        ) : (
          "미션 완료하기"
        )}
      </Button>
    </div>
  );
}
