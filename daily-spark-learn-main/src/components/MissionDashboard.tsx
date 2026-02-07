import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  CheckCircle2,
  Image,
  CircleDot,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type DayMission, type MissionStep, type QuizStep } from "@/lib/missionContent";
import { FigmaUILocator } from "@/components/FigmaUILocator";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { Troubleshooter } from "@/components/Troubleshooter";
import confetti from "canvas-confetti";

interface MissionDashboardProps {
  mission: DayMission;
  onComplete: () => void;
}

export function MissionDashboard({ mission, onComplete }: MissionDashboardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<"correct" | "incorrect" | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const totalSteps = mission.steps.length;
  const progress = (completedSteps.length / totalSteps) * 100;
  const activeStep = mission.steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const allCompleted = completedSteps.length === totalSteps;

  useEffect(() => {
    if (allCompleted) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B"],
      });
    }
  }, [allCompleted]);

  const handleActionComplete = () => {
    if (completedSteps.includes(currentStep)) return;

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7, x: 0.5 },
      colors: ["#10B981", "#34D399"],
    });

    setCompletedSteps((prev) => [...prev, currentStep]);

    if (isLastStep) {
      setTimeout(() => onComplete(), 1500);
    } else {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setSelectedQuizOption(null);
        setQuizResult(null);
        setShowSuccessMessage(false);
      }, 600);
    }
  };

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizResult !== null) return;

    setSelectedQuizOption(optionIndex);
    const quizStep = activeStep as QuizStep;

    if (optionIndex === quizStep.correctIndex) {
      setQuizResult("correct");
      setShowSuccessMessage(true);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#34D399", "#6EE7B7"],
      });

      setTimeout(() => {
        handleActionComplete();
      }, 1500);
    } else {
      setQuizResult("incorrect");
      setTimeout(() => {
        setQuizResult(null);
        setSelectedQuizOption(null);
      }, 1000);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex)) {
      setCurrentStep(stepIndex);
      setSelectedQuizOption(null);
      setQuizResult(null);
      setShowSuccessMessage(false);
    }
  };

  const renderStepContent = (step: MissionStep, index: number) => {
    const isActive = index === currentStep;
    const isCompleted = completedSteps.includes(index);
    const isLocked = index > currentStep && !isCompleted;

    if (isLocked) {
      return (
        <div
          key={step.id}
          className="relative p-4 rounded-xl bg-muted/30 border border-muted opacity-60"
        >
          <div className="absolute inset-0 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 blur-sm">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-muted-foreground">???</p>
          </div>
        </div>
      );
    }

    if (isCompleted && !isActive) {
      return (
        <button
          key={step.id}
          onClick={() => handleStepClick(index)}
          className="w-full p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3 text-left transition-all hover:bg-success/20"
        >
          <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-success-foreground" />
          </div>
          <p className="text-foreground/80 line-through decoration-success/50">
            {step.type === "action" ? step.instruction : (step as QuizStep).question}
          </p>
        </button>
      );
    }

    // Active step
    return (
      <div
        key={step.id}
        className={cn(
          "p-6 rounded-2xl border-2 transition-all duration-300",
          isActive
            ? "bg-card border-primary shadow-lg shadow-primary/10 animate-scale-in"
            : "bg-muted/50 border-muted"
        )}
      >
        {/* Step Header with Shortcut Key */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <div className="flex items-center gap-2">
              {step.type === "quiz" ? (
                <HelpCircle className="w-5 h-5 text-warning" />
              ) : (
                <CircleDot className="w-5 h-5 text-primary" />
              )}
              <span className="text-sm font-medium text-muted-foreground">
                {step.type === "quiz" ? "퀴즈" : "액션"}
              </span>
            </div>
          </div>
          
          {/* Keyboard Shortcut Display */}
          {step.shortcutKey && (
            <KeyboardShortcut shortcutKey={step.shortcutKey} />
          )}
        </div>

        {/* Content Grid: Image + UI Locator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Image Placeholder */}
          <div className="md:col-span-2 aspect-video bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center">
            <Image className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground/60 text-sm font-medium text-center px-4">
              {step.imageAlt}
            </p>
            <p className="text-muted-foreground/40 text-xs mt-1">스크린샷 위치</p>
          </div>

          {/* UI Locator Minimap */}
          <div className="flex items-center justify-center">
            <FigmaUILocator targetZone={step.targetZone || "none"} />
          </div>
        </div>

        {/* Instruction / Question */}
        <p className="text-lg md:text-xl font-medium text-center mb-6 leading-relaxed">
          {step.type === "action" ? step.instruction : (step as QuizStep).question}
        </p>

        {/* Troubleshooter Accordion */}
        {step.troubleshootTip && (
          <Troubleshooter tip={step.troubleshootTip} className="mb-6" />
        )}

        {/* Action Button or Quiz Options */}
        {step.type === "action" ? (
          <Button
            size="lg"
            onClick={handleActionComplete}
            disabled={isCompleted}
            className={cn(
              "w-full text-lg transition-all",
              isCompleted && "bg-success hover:bg-success"
            )}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                완료!
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {step.buttonText}
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            {(step as QuizStep).options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleQuizAnswer(optionIndex)}
                disabled={quizResult === "correct"}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                  selectedQuizOption === optionIndex
                    ? quizResult === "correct"
                      ? "border-success bg-success/20 text-success"
                      : quizResult === "incorrect"
                      ? "border-destructive bg-destructive/20 text-destructive animate-[shake_0.3s_ease-in-out]"
                      : "border-primary bg-primary/10"
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {option}
              </button>
            ))}

            {/* Success Message */}
            {showSuccessMessage && (
              <div className="mt-4 p-4 rounded-xl bg-success/10 border border-success/30 animate-fade-in">
                <p className="text-success font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {(step as QuizStep).successMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Progress Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-6 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Day {mission.day}: {mission.title}
            </h2>
            <p className="text-sm text-muted-foreground">{mission.subtitle}</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {completedSteps.length}
            </span>
            <span className="text-muted-foreground">/{totalSteps}</span>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Mission Steps List */}
      <div className="flex-1 space-y-4 pb-8">
        {mission.steps.map((step, index) => renderStepContent(step, index))}
      </div>

      {/* Completion Banner */}
      {allCompleted && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card p-8 rounded-3xl border-2 border-primary shadow-2xl text-center max-w-md mx-4 animate-scale-in">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Day {mission.day} 클리어! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              {mission.title} 미션을 완료했습니다!
            </p>
            <Button size="lg" onClick={onComplete} className="w-full">
              계속하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
