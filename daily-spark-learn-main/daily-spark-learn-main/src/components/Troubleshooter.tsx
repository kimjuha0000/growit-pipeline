import { useState } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TroubleshooterProps {
  tip: string;
  className?: string;
}

export function Troubleshooter({ tip, className }: TroubleshooterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("mt-4", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground",
          "hover:text-warning transition-colors",
          "group"
        )}
      >
        <AlertCircle className="w-4 h-4" />
        <span className="underline underline-offset-2 decoration-dashed">
          막혔나요? / 안 되나요?
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <p className="text-sm font-medium text-warning-foreground mb-1">
                문제 해결 팁
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
