import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { GameSelector } from "@/components/GameSelector";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import { figmaCurriculum, completeDay, getProgress } from "@/lib/curriculum";
import { ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { type LocalizedText } from "@/lib/missionContent";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const STUDY_STATS_REFRESH_EVENT = "study-stats:refresh";

const buildApiUrl = (path: string): string => {
  const fallbackBase = typeof window !== "undefined" ? window.location.origin : "";
  const baseUrl = API_BASE_URL || fallbackBase;
  return `${baseUrl}${path}`;
};

export default function Learn() {
  const { curriculumId, day } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { user, token } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasReportedProgress, setHasReportedProgress] = useState(false);
  const studySessionStartRef = useRef<number>(Date.now());

  const dayNumber = parseInt(day || "1", 10);
  const curriculum = figmaCurriculum;
  const currentDay = curriculum.days.find((d) => d.day === dayNumber);

  const getText = (text: LocalizedText): string => text[language];

  const reportStudyProgress = useCallback(
    async (minutes: number) => {
      if (!user || !token) return;

      try {
        const response = await fetch(buildApiUrl("/api/study/progress"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ minutes }),
        });

        if (!response.ok) return;
        window.dispatchEvent(new Event(STUDY_STATS_REFRESH_EVENT));
      } catch {
        // Intentionally ignore network failures so learning flow is not blocked.
      }
    },
    [token, user],
  );

  useEffect(() => {
    const progress = getProgress(curriculum.id);
    const canAccess = dayNumber === 1 || progress.includes(dayNumber - 1);
    
    if (!canAccess) {
      navigate("/curriculum");
    }
  }, [dayNumber, curriculum.id, navigate]);

  useEffect(() => {
    setHasReportedProgress(false);
    studySessionStartRef.current = Date.now();
  }, [curriculumId, dayNumber]);

  if (!currentDay) {
    return null;
  }

  const handleMissionComplete = () => {
    completeDay(curriculum.id, dayNumber);
    setShowCelebration(true);

    if (!hasReportedProgress) {
      setHasReportedProgress(true);
      const elapsedMinutes = Math.max(1, Math.ceil((Date.now() - studySessionStartRef.current) / 60000));
      void reportStudyProgress(elapsedMinutes);
    }
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
