import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MissionCard } from "@/components/MissionCard";
import { CompletionCelebration } from "@/components/CompletionCelebration";
import { figmaCurriculum, completeDay, getProgress } from "@/lib/curriculum";
import { ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Learn() {
  const { curriculumId, day } = useParams();
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const dayNumber = parseInt(day || "1", 10);
  const curriculum = figmaCurriculum;
  const currentDay = curriculum.days.find((d) => d.day === dayNumber);

  useEffect(() => {
    // Check if user has access to this day
    const progress = getProgress(curriculum.id);
    const canAccess = dayNumber === 1 || progress.includes(dayNumber - 1);
    
    if (!canAccess) {
      navigate("/curriculum");
    }

    // Simulate video being "watched" after 3 seconds for demo
    const timer = setTimeout(() => {
      setVideoWatched(true);
    }, 3000);

    return () => clearTimeout(timer);
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
          목록으로
        </Button>
      </div>

      <main className="container py-8 max-w-3xl mx-auto">
        {/* Day Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Day {dayNumber} / {curriculum.days.length}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {currentDay.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>{currentDay.objective}</span>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <VideoPlayer
            videoId={currentDay.videoId}
            onComplete={() => setVideoWatched(true)}
          />
        </div>

        {/* Mission Section - appears after video */}
        <div 
          className={`transition-all duration-500 ${
            videoWatched 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-muted-foreground px-4">
              영상을 보셨나요? 이제 직접 해볼 시간이에요!
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <MissionCard
            mission={currentDay.mission}
            hint={currentDay.hint}
            onComplete={handleMissionComplete}
          />
        </div>

        {/* Waiting message */}
        {!videoWatched && (
          <div className="text-center py-8 animate-pulse">
            <p className="text-muted-foreground">
              영상을 시청하면 미션이 나타나요...
            </p>
          </div>
        )}
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
