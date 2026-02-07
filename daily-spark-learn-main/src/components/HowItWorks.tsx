import { Play, PenTool, Unlock } from "lucide-react";

const steps = [
  {
    icon: Play,
    title: "3분 영상",
    description: "핵심만 담은 짧은 영상으로 개념을 익혀요",
  },
  {
    icon: PenTool,
    title: "2분 행동",
    description: "배운 내용을 바로 실습해보는 미니 미션",
  },
  {
    icon: Unlock,
    title: "다음 Day 해금",
    description: "완료하면 다음 학습이 자동으로 열려요",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            이렇게 진행돼요
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            하루 5분, 딱 10일. 부담 없이 시작하세요.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-card rounded-2xl p-8 shadow-card border border-border transition-all duration-200 ease-out hover:translate-y-[-4px] hover:shadow-lg"
            >
              {/* Step Number Badge */}
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-6">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 transition-transform duration-200 ease-out group-hover:scale-105">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
