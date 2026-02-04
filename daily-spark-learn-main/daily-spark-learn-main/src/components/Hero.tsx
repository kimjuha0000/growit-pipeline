import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
// =======================================================================
// 이벤트 전송을 위한 모듈과 익명 ID 생성을 위한 Hook을 가져옵니다.
// =======================================================================
import { useId } from "react";
import { sendEvent } from "@/lib/api";
// =======================================================================

export function Hero() {
  const navigate = useNavigate();
  // =======================================================================
  // 사용자의 세션 동안 고유하고 안정적인 ID를 생성합니다.
  // 이 ID는 사용자가 로그인하지 않았을 때 익명 사용자 식별자로 사용됩니다.
  // =======================================================================
  const anonymousId = useId();
  // =======================================================================

  // =======================================================================
  // CTA 버튼 클릭 시 실행될 핸들러 함수입니다.
  // =======================================================================
  const handleCTAClick = () => {
    // 백엔드로 전송할 이벤트 객체를 정의합니다.
    sendEvent({
      event_type: 'cta_click', // 이벤트 유형: Call To Action 클릭
      anonymous_id: anonymousId, // 생성된 익명 사용자 ID
      metadata: {
        component: 'Hero', // 이벤트가 발생한 컴포넌트
        button_text: '오늘 5분 시작하기', // 클릭된 버튼의 텍스트
      },
    });

    // 이벤트 전송 후, 원래의 네비게이션 동작을 수행합니다.
    navigate("/curriculum");
  };
  // =======================================================================

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
              // =======================================================================
              // 기존의 인라인 함수 대신, 위에서 정의한 핸들러 함수를 연결합니다.
              // =======================================================================
              onClick={handleCTAClick}
              // =======================================================================
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
