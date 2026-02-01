import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Zap,
    title: "5분이면 충분해요",
    description: "긴 강의가 아니에요. 하루 5분만 투자하세요.",
  },
  {
    icon: Target,
    title: "핵심만 콕콕",
    description: "불필요한 내용 없이 정말 필요한 것만 배워요.",
  },
  {
    icon: Sparkles,
    title: "직접 해보기",
    description: "영상만 보지 않아요. 매일 작은 실습이 있어요.",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            왜 GrowIt인가요?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
            기존 강의 플랫폼과는 다른 접근
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              오늘부터 시작해볼까요?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Figma 입문 코스가 여러분을 기다리고 있어요.
              <br />
              하루 5분, 10일이면 피그마로 화면을 만들 수 있습니다.
            </p>
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/curriculum")}
              className="group"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-foreground">GrowIt</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 GrowIt. 하루 5분으로 성장하세요.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
