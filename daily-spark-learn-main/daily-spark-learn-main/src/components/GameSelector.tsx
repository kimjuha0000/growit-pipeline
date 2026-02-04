import {
  Day1Game,
  Day2Game,
  Day3Game,
  Day4Game,
  Day5Game,
  Day6Game,
  Day7Game,
  Day8Game,
  Day9Game,
  Day10Game,
} from "@/components/games";

interface GameSelectorProps {
  day: number;
  onComplete: () => void;
}

export function GameSelector({ day, onComplete }: GameSelectorProps) {
  switch (day) {
    case 1:
      return <Day1Game onComplete={onComplete} />;
    case 2:
      return <Day2Game onComplete={onComplete} />;
    case 3:
      return <Day3Game onComplete={onComplete} />;
    case 4:
      return <Day4Game onComplete={onComplete} />;
    case 5:
      return <Day5Game onComplete={onComplete} />;
    case 6:
      return <Day6Game onComplete={onComplete} />;
    case 7:
      return <Day7Game onComplete={onComplete} />;
    case 8:
      return <Day8Game onComplete={onComplete} />;
    case 9:
      return <Day9Game onComplete={onComplete} />;
    case 10:
      return <Day10Game onComplete={onComplete} />;
    default:
      return <Day1Game onComplete={onComplete} />;
  }
}
