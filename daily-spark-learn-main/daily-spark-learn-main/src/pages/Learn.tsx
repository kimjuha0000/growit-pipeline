import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { GameSelector } from "@/components/GameSelector";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import { figmaCurriculum, completeDay, getProgress } from "@/lib/curriculum";
import { ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { type LocalizedText } from "@/lib/missionContent";

export default function Learn() {
  const { curriculumId, day } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [showCelebration, setShowCelebration] = useState(false);

  const dayNumber = parseInt(day || "1", 10);
  const curriculum = figmaCurriculum;
  const currentDay = curriculum.days.find((d) => d.day === dayNumber);

  const getText = (text: LocalizedText): string => text[language];

  useEffect(() => {
    const progress = getProgress(curriculum.id);
    const canAccess = dayNumber === 1 || progress.includes(dayNumber - 1);
    
    if (!canAccess) {
      navigate("/curriculum");
    }
  }, [dayNumber, curriculum.id, navigate]);

  if (!currentDay) {
    return null;
  }

  const handleMissionComplete = () => {
    completeDay(curriculum.id, dayNumber);
    setShowCelebration(true);
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate("/curriculum");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container pt-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/curriculum")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t({ ko: "목록으로", en: "Back to list" })}
        </Button>
      </div>

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Day Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Day {dayNumber} / {curriculum.days.length}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getText(currentDay.title)}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>{getText(currentDay.objective)}</span>
          </div>
        </div>

        {/* Interactive Game */}
        <div className="mb-8">
          <GameSelector day={dayNumber} onComplete={handleMissionComplete} />
        </div>
      </main>

      {/* Celebration Modal */}
      {showCelebration && (
        <CompletionCelebration
          dayNumber={dayNumber}
          onContinue={handleCelebrationContinue}
        />
      )}
    </div>
  );
}
