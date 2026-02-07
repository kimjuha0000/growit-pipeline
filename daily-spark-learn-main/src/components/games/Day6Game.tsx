import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { LayoutGrid } from "lucide-react";

interface Day6GameProps {
  onComplete: () => void;
}

export function Day6Game({ onComplete }: Day6GameProps) {
  const [isAutoLayout, setIsAutoLayout] = useState(false);
  const [gap, setGap] = useState([16]);

  const handleApplyAutoLayout = () => {
    setIsAutoLayout(true);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">✨ 오토 레이아웃 마법</h3>
        <p className="text-sm text-muted-foreground">
          흩어진 버튼들을 오토 레이아웃으로 정리해보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[200px] relative mb-6">
        {!isAutoLayout ? (
          <>
            {/* Scattered buttons */}
            <div className="absolute top-4 left-8">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                홈
              </button>
            </div>
            <div className="absolute bottom-8 right-12">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                소개
              </button>
            </div>
            <div className="absolute top-1/2 left-1/3">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                연락처
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center h-full transition-all duration-300"
            style={{ gap: `${gap[0]}px` }}
          >
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:translate-y-[-2px]">
              홈
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:translate-y-[-2px]">
              소개
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:translate-y-[-2px]">
              연락처
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        <Button
          onClick={handleApplyAutoLayout}
          disabled={isAutoLayout}
          variant={isAutoLayout ? "secondary" : "default"}
          className="gap-2"
        >
          <LayoutGrid className="w-4 h-4" />
          {isAutoLayout ? "오토 레이아웃 적용됨 ✓" : "오토 레이아웃 적용"}
        </Button>

        {isAutoLayout && (
          <div className="animate-fade-in">
            <label className="text-sm font-medium mb-2 block">
              간격: {gap[0]}px
            </label>
            <Slider
              value={gap}
              onValueChange={setGap}
              min={4}
              max={48}
              step={4}
              className="w-full max-w-xs"
            />
          </div>
        )}
      </div>

      {/* Completion */}
      {isAutoLayout && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🪄 오토 레이아웃이 디자인을 자동으로 정리해줘요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
