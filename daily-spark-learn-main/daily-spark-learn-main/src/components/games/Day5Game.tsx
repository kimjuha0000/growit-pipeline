import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Circle, Loader2 } from "lucide-react";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=300&fit=crop",
];

interface Day5GameProps {
  onComplete: () => void;
}

export function Day5Game({ onComplete }: Day5GameProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isMasked, setIsMasked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadImage = () => {
    setIsLoading(true);
    setIsMasked(false);
    setTimeout(() => {
      const randomImage = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
      setImageUrl(randomImage);
      setIsLoading(false);
    }, 800);
  };

  const handleApplyMask = () => {
    if (!imageUrl) return;
    setIsMasked(true);
  };

  const isComplete = imageUrl && isMasked;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🖼️ 이미지 불러오기</h3>
        <p className="text-sm text-muted-foreground">
          이미지를 불러오고 원형 마스크를 적용해보세요!
        </p>
      </div>

      {/* Preview Area */}
      <div className="bg-muted/50 rounded-xl p-8 min-h-[240px] flex items-center justify-center mb-6">
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Unsplash에서 불러오는 중...</p>
          </div>
        ) : imageUrl ? (
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              isMasked ? "rounded-full" : "rounded-xl"
            }`}
          >
            <img
              src={imageUrl}
              alt="랜덤 자연 이미지"
              className="w-48 h-48 object-cover"
            />
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Image className="w-8 h-8" />
            </div>
            <p className="text-sm">아직 이미지가 없어요</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={handleLoadImage}
          disabled={isLoading}
          variant="default"
          className="gap-2"
        >
          <Image className="w-4 h-4" />
          {isLoading ? "불러오는 중..." : "Unsplash 플러그인 실행"}
        </Button>
        <Button
          onClick={handleApplyMask}
          disabled={!imageUrl || isMasked || isLoading}
          variant={isMasked ? "secondary" : "outline"}
          className="gap-2"
        >
          <Circle className="w-4 h-4" />
          {isMasked ? "마스크 적용됨 ✓" : "원형 마스크 적용"}
        </Button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            📸 완벽한 원형 아바타! 마스크는 정말 강력해요.
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
