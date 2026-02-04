import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { DayCard } from "@/components/DayCard";
import { ProgressBar } from "@/components/ProgressBar";
import { figmaCurriculum, getProgress } from "@/lib/curriculum";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

type DayStatus = "completed" | "available" | "locked";

export default function Curriculum() {
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const curriculum = figmaCurriculum;

  useEffect(() => {
    setCompletedDays(getProgress(curriculum.id));
  }, [curriculum.id]);

  const getDayStatus = (day: number): DayStatus => {
    if (completedDays.includes(day)) return "completed";
    if (day === 1 || completedDays.includes(day - 1)) return "available";
    return "locked";
  };

  const handleDayClick = (day: number) => {
    const status = getDayStatus(day);
    if (status !== "locked") {
      navigate(`/learn/${curriculum.id}/${day}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-12">
        {/* Course Header */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {curriculum.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {curriculum.description}
          </p>

          <ProgressBar
            current={completedDays.length}
            total={curriculum.days.length}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Day Cards List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {curriculum.days.map((day) => (
            <DayCard
              key={day.day}
              day={day.day}
              title={day.title}
              status={getDayStatus(day.day)}
              onClick={() => handleDayClick(day.day)}
            />
          ))}
        </div>

        {/* Login Prompt */}
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-accent/50 rounded-2xl text-center">
          <p className="text-muted-foreground mb-2">
            💡 진행 상황을 저장하려면 로그인하세요
          </p>
          <button 
            onClick={() => navigate("/auth")}
            className="text-primary font-medium hover:underline"
          >
            로그인하기 →
          </button>
        </div>
      </main>
    </div>
  );
}
