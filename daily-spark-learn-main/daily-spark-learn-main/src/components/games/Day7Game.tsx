import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface Day7GameProps {
  onComplete: () => void;
}

const COLORS = [
  { name: "파랑", class: "bg-primary" },
  { name: "초록", class: "bg-success" },
  { name: "보라", class: "bg-purple-500" },
  { name: "주황", class: "bg-orange-500" },
];

export function Day7Game({ onComplete }: Day7GameProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [hasChanged, setHasChanged] = useState(false);

  const handleColorChange = (color: typeof COLORS[0]) => {
    setSelectedColor(color);
    if (color !== COLORS[0]) {
      setHasChanged(true);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🔄 대량 생산</h3>
        <p className="text-sm text-muted-foreground">
          마스터 컴포넌트를 바꾸고 인스턴스가 업데이트되는 걸 확인해보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[200px] mb-6">
        <div className="flex flex-col items-center gap-6">
          {/* Master */}
          <div className="text-center">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">
              마스터
            </span>
            <div
              className={`px-6 py-3 ${selectedColor.class} text-white rounded-xl font-semibold transition-all duration-200 ring-2 ring-offset-2 ring-primary`}
            >
              구독하기
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-px h-6 bg-border" />
            <Copy className="w-4 h-4" />
            <div className="w-px h-6 bg-border" />
          </div>

          {/* Instances */}
          <div className="flex gap-4">
            <div className="text-center">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                인스턴스 1
              </span>
              <div
                className={`px-6 py-3 ${selectedColor.class} text-white rounded-xl font-semibold transition-all duration-200`}
              >
                구독하기
              </div>
            </div>
            <div className="text-center">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                인스턴스 2
              </span>
              <div
                className={`px-6 py-3 ${selectedColor.class} text-white rounded-xl font-semibold transition-all duration-200`}
              >
                구독하기
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">
          마스터 색상 변경:
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color)}
              className={`w-10 h-10 rounded-lg ${color.class} transition-all duration-200 ${
                selectedColor.name === color.name
                  ? "ring-2 ring-offset-2 ring-foreground scale-110"
                  : "hover:scale-105"
              }`}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Completion */}
      {hasChanged && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🎯 컴포넌트가 디자인의 일관성을 대규모로 유지해줘요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
