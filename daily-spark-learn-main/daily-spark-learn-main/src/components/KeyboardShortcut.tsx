import { cn } from "@/lib/utils";

interface KeyboardShortcutProps {
  shortcutKey: string;
  className?: string;
}

export function KeyboardShortcut({ shortcutKey, className }: KeyboardShortcutProps) {
  // Handle special keys display
  const displayKey = () => {
    const keyMap: Record<string, string> = {
      "Space": "␣",
      "Spacebar": "␣",
      "Ctrl": "Ctrl",
      "Cmd": "⌘",
      "Shift": "⇧",
      "Alt": "Alt",
      "Enter": "↵",
    };
    return keyMap[shortcutKey] || shortcutKey.toUpperCase();
  };

  const isMultiKey = shortcutKey.includes("+");

  if (isMultiKey) {
    const keys = shortcutKey.split("+").map(k => k.trim());
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {keys.map((key, index) => (
          <span key={key}>
            <kbd
              className={cn(
                "inline-flex items-center justify-center",
                "min-w-[32px] h-8 px-2",
                "bg-muted border-2 border-border",
                "rounded-lg shadow-[0_2px_0_0] shadow-border",
                "font-mono font-bold text-sm text-foreground",
                "transition-all hover:translate-y-0.5 hover:shadow-none"
              )}
            >
              {displayKey.call(null, key) || key.toUpperCase()}
            </kbd>
            {index < keys.length - 1 && (
              <span className="text-muted-foreground mx-0.5">+</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "min-w-[44px] h-11 px-3",
        "bg-gradient-to-b from-muted to-muted/80",
        "border-2 border-border",
        "rounded-xl shadow-[0_4px_0_0] shadow-border",
        "font-mono font-bold text-lg text-foreground",
        "transition-all hover:translate-y-1 hover:shadow-none",
        "relative overflow-hidden",
        className
      )}
    >
      {/* Key shine effect */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      {displayKey()}
    </kbd>
  );
}
