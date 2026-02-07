import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlignCenter } from "lucide-react";

interface Day2GameProps {
  onComplete: () => void;
}

export function Day2Game({ onComplete }: Day2GameProps) {
  const [aligned, setAligned] = useState(false);

  const handleAlign = () => {
    setAligned(true);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🏗️ 구조물 배치</h3>
        <p className="text-sm text-muted-foreground">
          도형을 정렬해서 로봇 얼굴을 만들어보세요!
        </p>
      </div>

      {/* Canvas Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[280px] relative overflow-hidden mb-6">
        {/* Square (head) */}
        <div
          className={`w-24 h-24 bg-primary rounded-xl absolute transition-all duration-500 ease-out ${
            aligned
              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "left-4 top-4"
          }`}
        >
          {/* Eyes */}
          {aligned && (
            <div className="flex gap-4 justify-center pt-6 animate-fade-in">
              <div className="w-4 h-4 bg-white rounded-full" />
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          )}
        </div>

        {/* Circle (nose) */}
        <div
          className={`w-8 h-8 bg-amber-400 rounded-full absolute transition-all duration-500 ease-out delay-100 ${
            aligned
              ? "left-1/2 top-1/2 -translate-x-1/2 translate-y-2"
              : "right-8 bottom-8"
          }`}
        />

        {/* Mouth */}
        {aligned && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 w-12 h-3 bg-white rounded-full animate-fade-in" />
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleAlign}
          disabled={aligned}
          variant={aligned ? "secondary" : "default"}
          className="gap-2"
        >
          <AlignCenter className="w-4 h-4" />
          {aligned ? "정렬 완료 ✓" : "가운데 정렬"}
        </Button>
      </div>

      {/* Completion */}
      {aligned && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🤖 로봇 얼굴을 만들었어요! 정렬은 디자인의 핵심이에요.
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
