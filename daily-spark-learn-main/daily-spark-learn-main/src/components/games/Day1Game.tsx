import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

const COLORS = ["bg-white", "bg-primary", "bg-success", "bg-amber-400", "bg-pink-400"];

interface Day1GameProps {
  onComplete: () => void;
}

export function Day1Game({ onComplete }: Day1GameProps) {
  const [frameCreated, setFrameCreated] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [colorChanged, setColorChanged] = useState(false);

  const handleCreateFrame = () => {
    setFrameCreated(true);
  };

  const handleChangeColor = () => {
    if (!frameCreated) return;
    const newIndex = (colorIndex + 1) % COLORS.length;
    setColorIndex(newIndex);
    if (newIndex !== 0) {
      setColorChanged(true);
    }
  };

  const isComplete = frameCreated && colorChanged;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🗺️ 지도 탐험</h3>
        <p className="text-sm text-muted-foreground">
          아이폰 프레임을 만들고 색상을 바꿔보세요!
        </p>
      </div>

      {/* Canvas Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[280px] flex items-center justify-center mb-6">
        {!frameCreated ? (
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8" />
            </div>
            <p className="text-sm">빈 캔버스 - 프레임을 만들어보세요!</p>
          </div>
        ) : (
          <div
            className={`w-[180px] h-[320px] rounded-3xl border-4 border-foreground/20 ${COLORS[colorIndex]} transition-all duration-200 ease-out shadow-lg`}
          >
            <div className="w-16 h-1.5 bg-foreground/20 rounded-full mx-auto mt-3" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleCreateFrame}
          disabled={frameCreated}
          variant={frameCreated ? "secondary" : "default"}
          className="gap-2"
        >
          <Smartphone className="w-4 h-4" />
          {frameCreated ? "프레임 생성됨 ✓" : "아이폰 프레임 만들기"}
        </Button>
        <Button
          onClick={handleChangeColor}
          disabled={!frameCreated}
          variant="outline"
        >
          색상 변경
        </Button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            ✨ 훌륭해요! 프레임을 만들고 스타일을 적용했어요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
