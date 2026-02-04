import { Check, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionCelebrationProps {
  dayNumber: number;
  onContinue: () => void;
}

export function CompletionCelebration({ dayNumber, onContinue }: CompletionCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      {/* Celebration Card */}
      <div className="bg-card rounded-3xl p-10 shadow-lg border border-border max-w-md mx-4 text-center animate-scale-in">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
            <Check className="w-10 h-10 text-success-foreground animate-check-bounce" />
          </div>
        </div>

        {/* Party Icon */}
        <PartyPopper className="w-8 h-8 text-warning mx-auto mb-4" />

        <h2 className="text-2xl font-bold mb-2">
          Day {dayNumber} 완료! 🎉
        </h2>
        
        <p className="text-muted-foreground mb-6">
          대단해요! 오늘의 학습을 마쳤습니다.
          <br />
          내일 Day {dayNumber + 1}이 열려요.
        </p>

        <div className="bg-accent/50 rounded-xl p-4 mb-8">
          <p className="text-sm font-medium text-accent-foreground">
            🔓 Day {dayNumber + 1}이 해금되었습니다!
          </p>
        </div>

        <Button variant="default" size="lg" onClick={onContinue} className="w-full">
          확인
        </Button>
      </div>
    </div>
  );
}
