import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-accent/30 py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>하루 5분 · 10일 완성</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            하루 5분으로,
            <br />
            <span className="text-primary">부담 없이 시작해,</span>
            <br />
            어느새 해낸 학습
          </h1>

          {/* Sub Headline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            하루 5분씩, 필요한 것만 남깁니다.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/curriculum")}
              className="gap-2"
            >
              오늘 5분 시작하기
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              로그인 없이 바로 시작 가능
            </p>
          </div>
        </div>

        {/* Day Cards Preview - Grid Layout */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[1, 2, 3].map((day, index) => (
              <div
                key={day}
                className="w-full bg-card rounded-2xl border border-border p-4 shadow-card transition-all duration-200 ease-out hover:translate-y-[-4px] hover:shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-xs font-medium text-primary mb-1">Day {day}</div>
                <div className="text-sm font-semibold text-foreground">
                  {day === 1 ? "시작하기" : day === 2 ? "기본 익히기" : "실습하기"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
