import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Play } from "lucide-react";

interface Day8GameProps {
  onComplete: () => void;
}

export function Day8Game({ onComplete }: Day8GameProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeFrame, setActiveFrame] = useState<"A" | "B">("A");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleNavigate = () => {
    if (!isConnected || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveFrame(activeFrame === "A" ? "B" : "A");
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🌀 포탈 생성</h3>
        <p className="text-sm text-muted-foreground">
          두 프레임을 연결하고 인터랙티브 프로토타입을 만들어보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[240px] mb-6">
        <div className="flex items-center justify-center gap-8 relative">
          {/* Frame A */}
          <div
            onClick={isConnected ? handleNavigate : undefined}
            className={`w-32 h-48 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
              activeFrame === "A"
                ? "bg-primary/10 border-primary scale-105"
                : "bg-card border-border"
            } ${isConnected ? "cursor-pointer hover:scale-105" : ""}`}
          >
            <span className="font-semibold mb-2">프레임 A</span>
            <span className="text-xs text-muted-foreground">홈</span>
            {isConnected && activeFrame === "A" && (
              <div className="mt-4 animate-fade-in">
                <Play className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>

          {/* Connection Line */}
          <div className="relative">
            {isConnected ? (
              <div className="flex items-center gap-2 animate-fade-in">
                <div className="w-8 h-0.5 bg-primary" />
                <div className="w-3 h-3 border-t-2 border-r-2 border-primary rotate-45" />
              </div>
            ) : (
              <div className="w-16 h-0.5 bg-border border-dashed" />
            )}
          </div>

          {/* Frame B */}
          <div
            onClick={isConnected ? handleNavigate : undefined}
            className={`w-32 h-48 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 ${
              activeFrame === "B"
                ? "bg-success/10 border-success scale-105"
                : "bg-card border-border"
            } ${isConnected ? "cursor-pointer hover:scale-105" : ""}`}
          >
            <span className="font-semibold mb-2">프레임 B</span>
            <span className="text-xs text-muted-foreground">프로필</span>
            {isConnected && activeFrame === "B" && (
              <div className="mt-4 animate-fade-in">
                <Play className="w-6 h-6 text-success" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleConnect}
          disabled={isConnected}
          variant={isConnected ? "secondary" : "default"}
          className="gap-2"
        >
          <Link2 className="w-4 h-4" />
          {isConnected ? "연결됨 ✓" : "프레임 연결하기"}
        </Button>
        {isConnected && (
          <p className="text-sm text-muted-foreground self-center animate-fade-in">
            프레임을 클릭해서 이동해보세요!
          </p>
        )}
      </div>

      {/* Completion */}
      {isConnected && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🚀 프로토타입이 디자인에 생명을 불어넣어요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
