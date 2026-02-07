import { MissionDashboard } from "@/components/MissionDashboard";
import { missionContent } from "@/lib/missionContent";

interface GameSelectorProps {
  day: number;
  onComplete: () => void;
}

export function GameSelector({ day, onComplete }: GameSelectorProps) {
  const mission = missionContent.find((m) => m.day === day);

  if (!mission) {
    const fallbackMission = missionContent[0];
    if (!fallbackMission) return null;
    return <MissionDashboard mission={fallbackMission} onComplete={onComplete} />;
  }

  return <MissionDashboard mission={mission} onComplete={onComplete} />;
}
