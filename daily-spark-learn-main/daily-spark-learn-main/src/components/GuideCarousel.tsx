import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Image, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type DayGuide } from "@/lib/guideContent";

interface GuideCarouselProps {
  guide: DayGuide;
  onComplete: () => void;
}

export function GuideCarousel({ guide, onComplete }: GuideCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = guide.steps.length;
  const step = guide.steps[currentStep];
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-muted-foreground">
          Day {guide.day}: {guide.title}
        </span>
        <span className="text-sm font-semibold text-primary">
          Step {currentStep + 1} / {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Image Placeholder */}
      <div className="aspect-video bg-muted/50 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center mb-8">
        <Image className="w-16 h-16 text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground/60 text-sm font-medium text-center px-4">
          {step.imageAlt}
        </p>
        <p className="text-muted-foreground/40 text-xs mt-2">
          스크린샷 이미지 위치
        </p>
      </div>

      {/* Instruction Text */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <p className="text-xl md:text-2xl font-medium text-center leading-relaxed px-4">
          {step.instruction}
        </p>
      </div>

      {/* Step Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {guide.steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-200",
              index === currentStep
                ? "bg-primary w-8"
                : index < currentStep
                ? "bg-primary/40"
                : "bg-muted-foreground/20"
            )}
            aria-label={`Step ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          이전
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          className={cn("flex-1", isLastStep && "bg-success hover:bg-success/90")}
        >
          {isLastStep ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              완료!
            </>
          ) : (
            <>
              다음
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
