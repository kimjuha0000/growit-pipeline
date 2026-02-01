import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center gradient-hero overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>하루 5분 · 10일 완성</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            하루 5분으로,
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">부담 없이 시작해,</span>
            <br />
            어느새 해낸 학습
          </h1>

          {/* Sub Headline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            하루 5분씩,
            <br className="hidden md:block" />
            필요한 것만 남깁니다.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/curriculum")}
              className="group"
            >
              오늘 5분 시작하기
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-sm text-muted-foreground">
              로그인 없이 바로 시작 가능
            </p>
          </div>
        </div>

        {/* Floating Cards Preview */}
        <div className="mt-16 flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[1, 2, 3].map((day) => (
            <div
              key={day}
              className={`
                hidden sm:block w-32 h-24 rounded-2xl bg-card shadow-card border border-border/50
                transition-all duration-300 hover:-translate-y-2
                ${day === 1 ? 'translate-y-0' : day === 2 ? 'translate-y-4' : 'translate-y-2'}
              `}
              style={{ animationDelay: `${0.5 + day * 0.1}s` }}
            >
              <div className="p-4">
                <div className="text-xs font-medium text-primary mb-1">Day {day}</div>
                <div className="text-sm font-semibold text-foreground">
                  {day === 1 ? "시작하기" : day === 2 ? "기본 익히기" : "실습하기"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
