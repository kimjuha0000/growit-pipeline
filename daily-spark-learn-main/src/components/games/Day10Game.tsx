import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, PartyPopper } from "lucide-react";

interface Day10GameProps {
  onComplete: () => void;
}

export function Day10Game({ onComplete }: Day10GameProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExported(true);
      setShowConfetti(true);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            >
              {["🎉", "✨", "🎊", "⭐", "🌟"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🚀 세상에 출시</h3>
        <p className="text-sm text-muted-foreground">
          완성된 디자인을 내보내고 세상과 공유해보세요!
        </p>
      </div>

      {/* Preview Area - Final Design */}
      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Mini Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="font-bold">🏠 GrowIt</div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>홈</span>
              <span>소개</span>
              <span>연락처</span>
            </div>
            <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">
              로그인
            </button>
          </div>
          {/* Mini Content */}
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <PartyPopper className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-bold mb-1">디자인이 준비됐어요!</h4>
            <p className="text-xs text-muted-foreground">
              10일간의 학습 완료
            </p>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleExport}
          disabled={isExporting || isExported}
          variant={isExported ? "secondary" : "default"}
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              처리 중...
            </>
          ) : isExported ? (
            <>
              <Download className="w-4 h-4" />
              내보내기 완료 ✓
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              PNG로 내보내기
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {isExported && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <PartyPopper className="w-6 h-6 text-success" />
            <div>
              <p className="text-success font-semibold">
                🎉 데스크탑에 저장됐어요!
              </p>
              <p className="text-sm text-muted-foreground">
                축하해요! 10일 Figma 챌린지를 완료했어요!
              </p>
            </div>
          </div>
          <Button onClick={onComplete} variant="success">
            최종 미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
