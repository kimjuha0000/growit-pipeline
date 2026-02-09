import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseSelectionModal } from "@/components/CourseSelectionModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { sendEvent } from "@/lib/logger";

export function Hero() {
  const navigate = useNavigate();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const { t } = useLanguage();

  const handleCourseSelect = (courseId: string) => {
    void sendEvent("course_selected", {
      source: "hero_course_modal",
      course_id: courseId,
    });

    if (courseId === "figma") {
      setShowCourseModal(false);
      navigate("/curriculum");
    }
  };

  const handleHeroCtaClick = () => {
    void sendEvent("hero_cta_click", {
      component: "Hero",
      button_text: t(translations.hero.cta),
    });
    setShowCourseModal(true);
  };

  return (
    <>
      <CourseSelectionModal 
        open={showCourseModal} 
        onOpenChange={setShowCourseModal}
        onSelectCourse={handleCourseSelect}
      />
    <section className="bg-accent/30 py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{t(translations.hero.badge)}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t(translations.hero.headline1)}
            <br />
            <span className="text-primary">{t(translations.hero.headline2)}</span>
            <br />
            {t(translations.hero.headline3)}
          </h1>

          {/* Sub Headline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            {t(translations.hero.subheadline)}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="hero"
              size="xl"
              onClick={handleHeroCtaClick}
              className="gap-2"
            >
              {t(translations.hero.cta)}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              {t(translations.hero.ctaNote)}
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
                  {day === 1 ? t(translations.hero.day1) : day === 2 ? t(translations.hero.day2) : t(translations.hero.day3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
