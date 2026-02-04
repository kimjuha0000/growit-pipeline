import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Type, Palette } from "lucide-react";

interface Day3GameProps {
  onComplete: () => void;
}

export function Day3Game({ onComplete }: Day3GameProps) {
  const [text, setText] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isSizeUp, setIsSizeUp] = useState(false);
  const [isBlue, setIsBlue] = useState(false);

  const hasText = text.length > 0;
  const hasStyled = isBold || isSizeUp || isBlue;
  const isComplete = hasText && hasStyled;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">📜 고대 문자</h3>
        <p className="text-sm text-muted-foreground">
          텍스트를 입력하고 타이포그래피 스타일을 적용해보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[160px] flex items-center justify-center mb-6">
        {text ? (
          <p
            className={`transition-all duration-200 ease-out ${
              isBold ? "font-bold" : "font-normal"
            } ${isSizeUp ? "text-4xl" : "text-2xl"} ${
              isBlue ? "text-primary" : "text-foreground"
            }`}
          >
            {text}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            텍스트를 입력하면 여기에 나타나요...
          </p>
        )}
      </div>

      {/* Input */}
      <div className="mb-4">
        <Input
          placeholder="'안녕하세요' 또는 아무 텍스트나 입력하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Style Toggles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() => setIsBold(!isBold)}
          variant={isBold ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Bold className="w-4 h-4" />
          굵게
        </Button>
        <Button
          onClick={() => setIsSizeUp(!isSizeUp)}
          variant={isSizeUp ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Type className="w-4 h-4" />
          크게
        </Button>
        <Button
          onClick={() => setIsBlue(!isBlue)}
          variant={isBlue ? "default" : "outline"}
          size="sm"
          className="gap-2"
        >
          <Palette className="w-4 h-4" />
          파란색
        </Button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            ✍️ 타이포그래피가 디자인을 말하게 해요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
