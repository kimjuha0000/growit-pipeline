import { cn } from "@/lib/utils";

export type TargetZone = 
  | "toolbar-top"
  | "sidebar-left"
  | "sidebar-right"
  | "canvas"
  | "none";

interface FigmaUILocatorProps {
  targetZone: TargetZone;
  className?: string;
}

export function FigmaUILocator({ targetZone, className }: FigmaUILocatorProps) {
  const getZoneClasses = (zone: TargetZone) => {
    if (zone === targetZone) {
      return "fill-primary/30 stroke-primary stroke-2 animate-pulse";
    }
    return "fill-muted/50 stroke-muted-foreground/30 stroke-1";
  };

  return (
    <div className={cn("relative", className)}>
      {/* Label */}
      <p className="text-xs text-muted-foreground mb-2 font-medium">UI 위치 가이드</p>
      
      {/* SVG Schematic */}
      <svg
        viewBox="0 0 160 100"
        className="w-full max-w-[180px] h-auto rounded-lg border border-border bg-background/50 p-2"
      >
        {/* Top Toolbar */}
        <rect
          x="4"
          y="4"
          width="152"
          height="12"
          rx="2"
          className={cn(
            "transition-all duration-300",
            getZoneClasses("toolbar-top")
          )}
        />
        {/* Top Toolbar Label */}
        <text
          x="80"
          y="12"
          textAnchor="middle"
          className="text-[6px] fill-muted-foreground pointer-events-none"
        >
          Toolbar
        </text>

        {/* Left Sidebar */}
        <rect
          x="4"
          y="20"
          width="28"
          height="76"
          rx="2"
          className={cn(
            "transition-all duration-300",
            getZoneClasses("sidebar-left")
          )}
        />
        {/* Left Sidebar Label */}
        <text
          x="18"
          y="60"
          textAnchor="middle"
          className="text-[5px] fill-muted-foreground pointer-events-none"
          transform="rotate(-90, 18, 60)"
        >
          Layers
        </text>

        {/* Canvas (Center) */}
        <rect
          x="36"
          y="20"
          width="88"
          height="76"
          rx="2"
          className={cn(
            "transition-all duration-300",
            getZoneClasses("canvas")
          )}
        />
        {/* Canvas Label */}
        <text
          x="80"
          y="60"
          textAnchor="middle"
          className="text-[8px] fill-muted-foreground pointer-events-none"
        >
          Canvas
        </text>
        {/* Canvas inner frame indicator */}
        <rect
          x="50"
          y="35"
          width="60"
          height="45"
          rx="1"
          className="fill-none stroke-muted-foreground/20 stroke-1 stroke-dashed"
        />

        {/* Right Sidebar */}
        <rect
          x="128"
          y="20"
          width="28"
          height="76"
          rx="2"
          className={cn(
            "transition-all duration-300",
            getZoneClasses("sidebar-right")
          )}
        />
        {/* Right Sidebar Label */}
        <text
          x="142"
          y="60"
          textAnchor="middle"
          className="text-[5px] fill-muted-foreground pointer-events-none"
          transform="rotate(90, 142, 60)"
        >
          Design
        </text>
      </svg>

      {/* Zone Description */}
      {targetZone !== "none" && (
        <p className="text-xs text-primary mt-2 font-medium animate-fade-in">
          {targetZone === "toolbar-top" && "👆 상단 툴바를 확인하세요"}
          {targetZone === "sidebar-left" && "👈 왼쪽 레이어 패널을 확인하세요"}
          {targetZone === "sidebar-right" && "👉 오른쪽 디자인 패널을 확인하세요"}
          {targetZone === "canvas" && "🎨 중앙 캔버스에서 작업하세요"}
        </p>
      )}
    </div>
  );
}
