import { Play, PenTool, Unlock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const stepsContent = [
  {
    icon: Play,
    title: { ko: "3분 영상", en: "3-Min Video" },
    description: { 
      ko: "핵심만 담은 짧은 영상으로 개념을 익혀요", 
      en: "Learn concepts with short, focused videos" 
    },
  },
  {
    icon: PenTool,
    title: { ko: "2분 행동", en: "2-Min Action" },
    description: { 
      ko: "배운 내용을 바로 실습해보는 미니 미션", 
      en: "Mini missions to practice what you learned" 
    },
  },
  {
    icon: Unlock,
    title: { ko: "다음 Day 해금", en: "Unlock Next Day" },
    description: { 
      ko: "완료하면 다음 학습이 자동으로 열려요", 
      en: "Complete to automatically unlock the next lesson" 
    },
  },
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {t({ ko: "이렇게 진행돼요", en: "How It Works" })}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t({ ko: "하루 5분, 딱 10일. 부담 없이 시작하세요.", en: "5 mins a day, just 10 days. Start without pressure." })}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stepsContent.map((step, index) => (
            <div
              key={index}
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
              <h3 className="text-xl font-semibold mb-2">{t(step.title)}</h3>
              <p className="text-muted-foreground">{t(step.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
