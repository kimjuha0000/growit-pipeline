import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CourseSelectionModal } from "@/components/CourseSelectionModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

const Index = () => {
  const navigate = useNavigate();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const { t } = useLanguage();

  const handleCourseSelect = (courseId: string) => {
    if (courseId === "figma") {
      setShowCourseModal(false);
      navigate("/curriculum");
    }
  };

  const features = [
    {
      icon: Zap,
      title: t(translations.features.feature1Title),
      description: t(translations.features.feature1Desc),
    },
    {
      icon: Target,
      title: t(translations.features.feature2Title),
      description: t(translations.features.feature2Desc),
    },
    {
      icon: Sparkles,
      title: t(translations.features.feature3Title),
      description: t(translations.features.feature3Desc),
    },
  ];

  return (
    <>
      <CourseSelectionModal 
        open={showCourseModal} 
        onOpenChange={setShowCourseModal}
        onSelectCourse={handleCourseSelect}
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <Hero />
        
        {/* How It Works Section */}
        <HowItWorks />

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t(translations.features.title)}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t(translations.features.subtitle)}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="text-center p-6"
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
        <section className="py-20 bg-accent/30">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(translations.cta.title)}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t(translations.cta.description1)}
                <br />
                {t(translations.cta.description2)}
              </p>
              <Button
                variant="hero"
                size="xl"
                onClick={() => setShowCourseModal(true)}
                className="gap-2"
              >
                {t(translations.cta.button)}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-background border-t border-border">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">G</span>
                </div>
                <span className="font-semibold text-foreground">GrowIt</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(translations.footer.copyright)}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
