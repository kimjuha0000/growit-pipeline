import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paintbrush, Square, Sparkles } from "lucide-react";

interface Day4GameProps {
  onComplete: () => void;
}

export function Day4Game({ onComplete }: Day4GameProps) {
  const [hasFill, setHasFill] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  const isComplete = hasFill && hasStroke && hasShadow;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🎨 세상에 색칠하기</h3>
        <p className="text-sm text-muted-foreground">
          채우기, 테두리, 그림자로 박스를 꾸며보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[200px] flex items-center justify-center mb-6">
        <div
          className={`w-48 h-16 rounded-xl transition-all duration-200 ease-out flex items-center justify-center ${
            hasFill ? "bg-primary text-primary-foreground" : "bg-muted"
          } ${hasStroke ? "border-4 border-foreground" : ""} ${
            hasShadow ? "shadow-xl" : ""
          }`}
        >
          <span className={`font-semibold ${hasFill ? "" : "text-muted-foreground"}`}>
            {isComplete ? "멋진 버튼!" : "평범한 박스"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() => setHasFill(true)}
          disabled={hasFill}
          variant={hasFill ? "secondary" : "default"}
          size="sm"
          className="gap-2"
        >
          <Paintbrush className="w-4 h-4" />
          {hasFill ? "채우기 완료 ✓" : "채우기 추가 (파랑)"}
        </Button>
        <Button
          onClick={() => setHasStroke(true)}
          disabled={hasStroke}
          variant={hasStroke ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Square className="w-4 h-4" />
          {hasStroke ? "테두리 완료 ✓" : "테두리 추가"}
        </Button>
        <Button
          onClick={() => setHasShadow(true)}
          disabled={hasShadow}
          variant={hasShadow ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {hasShadow ? "그림자 완료 ✓" : "그림자 추가"}
        </Button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🎉 평범한 박스를 멋진 버튼으로 바꿨어요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
