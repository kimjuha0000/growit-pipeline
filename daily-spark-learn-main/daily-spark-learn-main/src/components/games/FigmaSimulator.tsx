 import { useState, useCallback } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Slider } from "@/components/ui/slider";
 import { Progress } from "@/components/ui/progress";
 import { cn } from "@/lib/utils";
 import type { GameStep, DayGameConfig } from "@/lib/gameSteps";
 import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
 
 interface FigmaSimulatorProps {
   config: DayGameConfig;
   onComplete: () => void;
 }
 
 interface SimulatorState {
   [key: string]: boolean | string | number;
 }
 
 export function FigmaSimulator({ config, onComplete }: FigmaSimulatorProps) {
   const [currentStep, setCurrentStep] = useState(0);
   const [state, setState] = useState<SimulatorState>({});
   const [inputValue, setInputValue] = useState("");
   const [sliderValue, setSliderValue] = useState<number[]>([0]);
   const [showConfetti, setShowConfetti] = useState(false);
 
   const totalSteps = config.steps.length;
   const isComplete = currentStep >= totalSteps;
   const currentStepData = config.steps[currentStep];
   const progress = (currentStep / totalSteps) * 100;
 
   const handleElementClick = useCallback((elementId: string) => {
     if (!currentStepData || currentStepData.targetElement !== elementId) return;
     if (currentStepData.action === "input" || currentStepData.action === "slider") return;
     
     setState((prev) => ({ ...prev, [elementId]: true }));
     
     if (currentStep === totalSteps - 1) {
       setShowConfetti(true);
     }
     setCurrentStep((prev) => prev + 1);
   }, [currentStepData, currentStep, totalSteps]);
 
   const handleInputSubmit = useCallback(() => {
     if (!currentStepData || currentStepData.action !== "input") return;
     if (!inputValue.trim()) return;
     
     setState((prev) => ({ ...prev, [currentStepData.targetElement]: inputValue }));
     setInputValue("");
     setCurrentStep((prev) => prev + 1);
   }, [currentStepData, inputValue]);
 
   const handleSliderSubmit = useCallback(() => {
     if (!currentStepData || currentStepData.action !== "slider") return;
     
     setState((prev) => ({ ...prev, [currentStepData.targetElement]: sliderValue[0] }));
     setCurrentStep((prev) => prev + 1);
   }, [currentStepData, sliderValue]);
 
   const isElementActive = (elementId: string) => {
     return currentStepData?.targetElement === elementId;
   };
 
   const isElementCompleted = (elementId: string) => {
     return state[elementId] !== undefined;
   };
 
   const renderSimulatorElement = (
     elementId: string,
     children: React.ReactNode,
     className?: string
   ) => {
     const isActive = isElementActive(elementId);
     const isCompleted = isElementCompleted(elementId);
     const isDisabled = !isActive && !isCompleted;
 
     return (
       <div
         onClick={() => handleElementClick(elementId)}
         className={cn(
           "relative transition-all duration-200 cursor-pointer rounded-lg",
           isActive && "ring-2 ring-primary ring-offset-2 animate-pulse shadow-lg",
           isCompleted && "opacity-80",
           isDisabled && "opacity-40 pointer-events-none",
           className
         )}
       >
         {children}
         {isActive && (
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
             <ArrowRight className="w-2.5 h-2.5 text-primary-foreground" />
           </div>
         )}
         {isCompleted && (
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
             <CheckCircle2 className="w-3 h-3 text-success-foreground" />
           </div>
         )}
       </div>
     );
   };
 
  // Day-specific canvas renderers
  const renderDay1Canvas = () => (
    <div className="flex gap-4 h-full">
      {/* Toolbar */}
      <div className="w-12 bg-muted/30 rounded-lg p-2 flex flex-col gap-2">
        {renderSimulatorElement(
          "frame-tool",
          <div className="w-8 h-8 bg-card rounded flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-muted-foreground rounded" />
          </div>
        )}
        {state["frame-tool"] && renderSimulatorElement(
          "frame-option",
          <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center text-xs font-bold text-primary">
            F
          </div>
        )}
        {state["frame-option"] && renderSimulatorElement(
          "zoom-in",
          <div className="w-8 h-8 bg-card rounded flex items-center justify-center text-lg font-bold">
            +
          </div>
        )}
      </div>

      {/* Left Panel - Layers */}
      <div className="w-40 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-muted-foreground mb-2">레이어</div>
        {state["iphone-preset"] && renderSimulatorElement(
          "layer-name",
          <div className="flex items-center gap-2 p-2 bg-card rounded text-sm">
            <div className="w-4 h-4 bg-primary/20 rounded" />
            <span>{state["layer-name"] || "Frame 1"}</span>
          </div>
        )}
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center relative">
        {!state["iphone-preset"] ? (
          <div className="text-muted-foreground text-sm">프레임 도구를 선택하세요</div>
        ) : (
          renderSimulatorElement(
            "canvas-frame",
            <div
              className={cn(
                "w-[120px] h-[240px] rounded-2xl border-2 transition-all duration-300",
                state["blue-color"] ? "bg-primary border-primary/50" : "bg-white border-border",
                state["zoom-in"] && "scale-110"
              )}
            >
              <div className="w-10 h-1 bg-foreground/20 rounded-full mx-auto mt-2" />
              {state["clip-content"] && (
                <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-xl" />
              )}
            </div>
          )
        )}
      </div>

      {/* Right Panel - Properties */}
      <div className="w-48 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-muted-foreground">속성</div>
        
        {state["frame-option"] && renderSimulatorElement(
          "iphone-preset",
          <div className="p-2 bg-card rounded text-sm flex items-center gap-2">
            <div className="w-5 h-8 bg-muted rounded" />
            <span>iPhone 14</span>
          </div>
        )}

        {state["canvas-frame"] && renderSimulatorElement(
          "fill-color",
          <div className="p-2 bg-card rounded text-sm">
            <div className="flex items-center gap-2">
              <span>채우기</span>
              <div className={cn(
                "w-5 h-5 rounded border",
                state["blue-color"] ? "bg-primary" : "bg-white"
              )} />
            </div>
          </div>
        )}

        {state["fill-color"] && renderSimulatorElement(
          "blue-color",
          <div className="flex gap-1 p-2">
            <div className="w-5 h-5 rounded bg-red-500" />
            <div className="w-5 h-5 rounded bg-green-500" />
            <div className="w-5 h-5 rounded bg-primary ring-2 ring-primary ring-offset-1" />
            <div className="w-5 h-5 rounded bg-yellow-500" />
          </div>
        )}

        {state["blue-color"] && renderSimulatorElement(
          "clip-content",
          <label className="flex items-center gap-2 p-2 bg-card rounded text-sm cursor-pointer">
            <div className={cn(
              "w-4 h-4 rounded border-2",
              state["clip-content"] ? "bg-primary border-primary" : "border-muted-foreground"
            )}>
              {state["clip-content"] && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span>콘텐츠 자르기</span>
          </label>
        )}

        {state["clip-content"] && renderSimulatorElement(
          "done-button",
          <Button size="sm" className="w-full mt-2">완료</Button>
        )}
      </div>
    </div>
  );
 
   const renderDay2Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Toolbar */}
       <div className="w-12 bg-muted/30 rounded-lg p-2 flex flex-col gap-2">
         {renderSimulatorElement(
           "rect-tool",
           <div className="w-8 h-8 bg-card rounded flex items-center justify-center">
             <div className="w-4 h-4 bg-muted-foreground rounded-sm" />
           </div>
         )}
         {renderSimulatorElement(
           "ellipse-tool",
           <div className="w-8 h-8 bg-card rounded flex items-center justify-center">
             <div className="w-4 h-4 bg-muted-foreground rounded-full" />
           </div>
         )}
       </div>
 
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center relative">
         <div className={cn(
           "flex gap-8 transition-all duration-500",
           state["align-horizontal"] && state["align-vertical"] && "gap-0"
         )}>
           {state["canvas-draw-rect"] && renderSimulatorElement(
             "select-both",
             <div className={cn(
               "w-20 h-20 bg-primary rounded-lg transition-all",
               state["group-button"] && "ring-2 ring-accent"
             )} />
           )}
           {state["canvas-draw-circle"] && (
             <div className={cn(
               "w-16 h-16 rounded-full transition-all",
               state["red-color"] ? "bg-red-500" : "bg-muted-foreground",
               state["group-button"] && "ring-2 ring-accent"
             )} />
           )}
         </div>
         
         {!state["canvas-draw-rect"] && state["rect-tool"] && renderSimulatorElement(
           "canvas-draw-rect",
           <div className="w-20 h-20 border-2 border-dashed border-primary rounded-lg flex items-center justify-center text-primary text-xs">
             클릭해서 그리기
           </div>
         )}
         
         {state["canvas-draw-rect"] && !state["canvas-draw-circle"] && state["ellipse-tool"] && renderSimulatorElement(
           "canvas-draw-circle",
           <div className="w-16 h-16 border-2 border-dashed border-primary rounded-full flex items-center justify-center text-primary text-xs ml-8">
             클릭
           </div>
         )}
       </div>
 
       {/* Right Panel */}
       <div className="w-48 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">정렬</div>
         
         {state["canvas-draw-circle"] && renderSimulatorElement(
           "red-color",
           <div className="flex gap-1 p-2 bg-card rounded">
             <div className="w-5 h-5 rounded bg-red-500 ring-2 ring-primary" />
             <div className="w-5 h-5 rounded bg-blue-500" />
             <div className="w-5 h-5 rounded bg-green-500" />
           </div>
         )}
 
         {state["select-both"] && (
           <>
             {renderSimulatorElement(
               "align-vertical",
               <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                 ↕ 세로 중앙 정렬
               </Button>
             )}
             {state["align-vertical"] && renderSimulatorElement(
               "align-horizontal",
               <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                 ↔ 가로 중앙 정렬
               </Button>
             )}
           </>
         )}
 
         {state["align-horizontal"] && renderSimulatorElement(
           "group-button",
           <Button size="sm" className="w-full text-xs">그룹으로 묶기</Button>
         )}
 
         {state["group-button"] && renderSimulatorElement(
           "group-name",
           <div className="p-2 bg-card rounded text-sm">
             <span className="text-muted-foreground text-xs">그룹 이름:</span>
             <div className="font-medium">{state["group-name"] || "Group 1"}</div>
           </div>
         )}
       </div>
     </div>
   );
 
   const renderDay3Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Toolbar */}
       <div className="w-12 bg-muted/30 rounded-lg p-2 flex flex-col gap-2">
         {renderSimulatorElement(
           "text-tool",
           <div className="w-8 h-8 bg-card rounded flex items-center justify-center font-bold text-lg">
             T
           </div>
         )}
       </div>
 
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center">
         {!state["canvas-text"] && state["text-tool"] && renderSimulatorElement(
           "canvas-text",
           <div className="border-2 border-dashed border-primary rounded-lg p-8 text-primary text-sm">
             클릭하여 텍스트 추가
           </div>
         )}
 
         {state["canvas-text"] && renderSimulatorElement(
           "text-layer",
           <div
             className={cn(
               "transition-all duration-300",
               state["font-weight"] && "font-extrabold",
               state["font-size"] ? "text-5xl" : "text-2xl",
               state["text-color"] ? "text-foreground" : "text-muted-foreground",
               state["text-align"] && "text-center"
             )}
             style={{
               letterSpacing: state["letter-spacing"] ? `${(state["letter-spacing"] as number) * -0.02}em` : undefined
             }}
           >
             {state["text-input"] || "텍스트 입력 대기..."}
           </div>
         )}
       </div>
 
       {/* Right Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">텍스트 속성</div>
 
         {state["text-layer"] && (
           <>
             {renderSimulatorElement(
               "font-family",
               <div className="p-2 bg-card rounded text-sm flex justify-between items-center">
                 <span>글꼴</span>
                 <span className="text-primary">{state["font-family"] ? "Pretendard" : "선택..."}</span>
               </div>
             )}
 
             {state["font-family"] && renderSimulatorElement(
               "font-weight",
               <div className="p-2 bg-card rounded text-sm flex justify-between items-center">
                 <span>굵기</span>
                 <span className="text-primary">{state["font-weight"] ? "Extra Bold" : "Regular"}</span>
               </div>
             )}
 
             {state["font-weight"] && renderSimulatorElement(
               "font-size",
               <div className="p-2 bg-card rounded text-sm flex justify-between items-center">
                 <span>크기</span>
                 <span className="text-primary">{state["font-size"] ? "48px" : "16px"}</span>
               </div>
             )}
 
             {state["font-size"] && renderSimulatorElement(
               "text-color",
               <div className="p-2 bg-card rounded text-sm flex justify-between items-center">
                 <span>색상</span>
                 <div className={cn(
                   "w-5 h-5 rounded border",
                   state["text-color"] ? "bg-foreground" : "bg-muted"
                 )} />
               </div>
             )}
 
             {state["text-color"] && renderSimulatorElement(
               "text-align",
               <div className="p-2 bg-card rounded text-sm flex justify-between items-center">
                 <span>정렬</span>
                 <span className="text-primary">{state["text-align"] ? "가운데" : "왼쪽"}</span>
               </div>
             )}
 
             {state["text-align"] && renderSimulatorElement(
               "letter-spacing",
               <div className="p-2 bg-card rounded text-sm">
                 <div className="flex justify-between items-center mb-2">
                   <span>자간</span>
                   <span className="text-primary">{sliderValue[0]}%</span>
                 </div>
               </div>
             )}
           </>
         )}
       </div>
     </div>
   );
 
   const renderDay4Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center">
         {renderSimulatorElement(
           "select-rect",
           <div
             className={cn(
               "w-48 h-24 transition-all duration-300",
               state["gradient-fill"] ? "bg-gradient-to-b from-primary to-primary/50" : "bg-muted",
               state["add-stroke"] && "border-4",
               state["stroke-color"] && "border-white",
               state["drop-shadow"] && "shadow-xl",
               state["corner-radius"] ? `rounded-[${state["corner-radius"]}px]` : "rounded-none"
             )}
             style={{
               borderRadius: state["corner-radius"] ? `${state["corner-radius"]}px` : undefined,
               boxShadow: state["shadow-blur"] ? `0 10px ${state["shadow-blur"]}px rgba(0,0,0,0.3)` : undefined
             }}
           />
         )}
       </div>
 
       {/* Right Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">스타일</div>
 
         {state["select-rect"] && (
           <>
             {renderSimulatorElement(
               "gradient-fill",
               <div className="p-2 bg-card rounded text-sm flex items-center gap-2">
                 <div className="w-6 h-6 rounded bg-gradient-to-b from-primary to-primary/50" />
                 <span>그라디언트 채우기</span>
               </div>
             )}
 
             {state["gradient-fill"] && renderSimulatorElement(
               "gradient-direction",
               <div className="p-2 bg-card rounded text-sm flex items-center gap-2">
                 <span>↓ 위→아래</span>
               </div>
             )}
 
             {state["gradient-direction"] && renderSimulatorElement(
               "add-stroke",
               <div className="p-2 bg-card rounded text-sm">+ 선 추가</div>
             )}
 
             {state["add-stroke"] && renderSimulatorElement(
               "stroke-color",
               <div className="p-2 bg-card rounded text-sm flex items-center gap-2">
                 <div className="w-5 h-5 rounded bg-white border" />
                 <span>흰색</span>
               </div>
             )}
 
             {state["stroke-color"] && renderSimulatorElement(
               "stroke-width",
               <div className="p-2 bg-card rounded text-sm">두께: 4px</div>
             )}
 
             {state["stroke-width"] && renderSimulatorElement(
               "stroke-inside",
               <div className="p-2 bg-card rounded text-sm">위치: 안쪽</div>
             )}
 
             {state["stroke-inside"] && renderSimulatorElement(
               "drop-shadow",
               <div className="p-2 bg-card rounded text-sm">+ 드롭 섀도우</div>
             )}
 
             {state["drop-shadow"] && renderSimulatorElement(
               "shadow-blur",
               <div className="p-2 bg-card rounded text-sm">
                 <div className="flex justify-between mb-2">
                   <span>블러</span>
                   <span>{sliderValue[0]}</span>
                 </div>
               </div>
             )}
 
             {state["shadow-blur"] && renderSimulatorElement(
               "corner-radius",
               <div className="p-2 bg-card rounded text-sm">
                 <div className="flex justify-between mb-2">
                   <span>모서리</span>
                   <span>{sliderValue[0]}px</span>
                 </div>
               </div>
             )}
           </>
         )}
       </div>
     </div>
   );
 
   const renderDay5Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Toolbar */}
       <div className="w-12 bg-muted/30 rounded-lg p-2 flex flex-col gap-2">
         {renderSimulatorElement(
           "star-tool",
           <div className="w-8 h-8 bg-card rounded flex items-center justify-center text-lg">⭐</div>
         )}
         {renderSimulatorElement(
           "resources-menu",
           <div className="w-8 h-8 bg-card rounded flex items-center justify-center text-lg">📦</div>
         )}
       </div>
 
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center relative">
         {state["star-tool"] && !state["draw-star"] && renderSimulatorElement(
           "draw-star",
           <div className="border-2 border-dashed border-primary rounded-lg p-12 text-primary">
             클릭하여 별 그리기
           </div>
         )}
 
         {state["nature-photo"] && (
           <div className={cn(
             "relative transition-all duration-500",
             state["use-mask"] && "overflow-hidden"
           )}>
             <img
               src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop"
               alt="자연"
               className={cn(
                 "w-40 h-40 object-cover transition-all",
                 state["use-mask"] && "clip-path-star",
                 state["resize-photo"] && "scale-110"
               )}
               style={{
                 clipPath: state["use-mask"] ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : undefined
               }}
             />
           </div>
         )}
 
         {state["draw-star"] && !state["nature-photo"] && (
           <div className="text-6xl">⭐</div>
         )}
       </div>
 
       {/* Plugin Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         {state["resources-menu"] && (
           <>
             <div className="text-xs font-semibold text-muted-foreground mb-2">플러그인</div>
             {renderSimulatorElement(
               "search-unsplash",
               <div className="p-2 bg-card rounded text-sm">
                 {state["search-unsplash"] ? "✓ Unsplash" : "검색..."}
               </div>
             )}
 
             {state["search-unsplash"] && renderSimulatorElement(
               "run-plugin",
               <Button size="sm" className="w-full">실행</Button>
             )}
 
             {state["run-plugin"] && renderSimulatorElement(
               "nature-photo",
               <div className="grid grid-cols-2 gap-1">
                 <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop" alt="" className="w-full rounded ring-2 ring-primary" />
                 <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=80&h=80&fit=crop" alt="" className="w-full rounded opacity-50" />
               </div>
             )}
           </>
         )}
 
         {state["nature-photo"] && (
           <>
             {renderSimulatorElement(
               "place-star",
               <Button variant="outline" size="sm" className="w-full">별 위로 배치</Button>
             )}
             {state["place-star"] && renderSimulatorElement(
               "select-both",
               <Button variant="outline" size="sm" className="w-full">둘 다 선택</Button>
             )}
             {state["select-both"] && renderSimulatorElement(
               "use-mask",
               <Button size="sm" className="w-full">마스크로 사용</Button>
             )}
             {state["use-mask"] && renderSimulatorElement(
               "resize-photo",
               <Button variant="outline" size="sm" className="w-full">크기 조절</Button>
             )}
           </>
         )}
       </div>
     </div>
   );
 
   const renderDay6Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center">
         <div className={cn(
           "flex transition-all duration-500",
           state["add-autolayout"] && "bg-card rounded-lg p-4 shadow-md",
           state["direction-horizontal"] ? "flex-row" : "flex-col",
           state["add-background"] && "bg-primary/10"
         )}
         style={{
           gap: state["gap-slider"] ? `${state["gap-slider"]}px` : "8px",
           paddingLeft: state["padding-horizontal"] ? `${state["padding-horizontal"]}px` : undefined,
           paddingRight: state["padding-horizontal"] ? `${state["padding-horizontal"]}px` : undefined,
         }}>
           {state["create-home"] && (
             <span className="px-3 py-1 text-sm font-medium">홈</span>
           )}
           {state["create-about"] && (
             <span className="px-3 py-1 text-sm font-medium">소개</span>
           )}
           {state["create-contact"] && (
             <span className="px-3 py-1 text-sm font-medium">
               {state["change-text"] || "연락처"}
             </span>
           )}
         </div>
       </div>
 
       {/* Right Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">오토 레이아웃</div>
 
         {renderSimulatorElement(
           "create-home",
           <Button variant="outline" size="sm" className="w-full">'홈' 텍스트 추가</Button>
         )}
         {state["create-home"] && renderSimulatorElement(
           "create-about",
           <Button variant="outline" size="sm" className="w-full">'소개' 텍스트 추가</Button>
         )}
         {state["create-about"] && renderSimulatorElement(
           "create-contact",
           <Button variant="outline" size="sm" className="w-full">'연락처' 텍스트 추가</Button>
         )}
         {state["create-contact"] && renderSimulatorElement(
           "select-all",
           <Button variant="outline" size="sm" className="w-full">모두 선택</Button>
         )}
         {state["select-all"] && renderSimulatorElement(
           "add-autolayout",
           <Button size="sm" className="w-full">오토 레이아웃 추가</Button>
         )}
         {state["add-autolayout"] && renderSimulatorElement(
           "direction-horizontal",
           <div className="p-2 bg-card rounded text-sm">방향: 가로</div>
         )}
         {state["direction-horizontal"] && renderSimulatorElement(
           "gap-slider",
           <div className="p-2 bg-card rounded text-sm">
             <span>간격: {sliderValue[0]}px</span>
           </div>
         )}
         {state["gap-slider"] && renderSimulatorElement(
           "padding-horizontal",
           <div className="p-2 bg-card rounded text-sm">
             <span>패딩: {sliderValue[0]}px</span>
           </div>
         )}
         {state["padding-horizontal"] && renderSimulatorElement(
           "add-background",
           <Button variant="outline" size="sm" className="w-full">배경색 추가</Button>
         )}
         {state["add-background"] && renderSimulatorElement(
           "change-text",
           <div className="p-2 bg-card rounded text-sm">텍스트 변경</div>
         )}
       </div>
     </div>
   );
 
   const renderDay7Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-around">
         {/* Main Component */}
         {state["create-component"] && (
           <div className="text-center">
             <div className="text-xs text-muted-foreground mb-1">메인 컴포넌트</div>
             {renderSimulatorElement(
               "select-main",
               <div className={cn(
                 "px-6 py-3 font-semibold transition-all duration-300",
                 state["change-color-purple"] ? "bg-purple-500" : "bg-primary",
                 state["corner-radius-0"] ? "rounded-none" : "rounded-xl",
                 "text-white"
               )}>
                 <div className="flex items-center gap-1">
                   <span className="text-purple-200">◆</span>
                   {state["component-name"] || "버튼"}
                 </div>
               </div>
             )}
           </div>
         )}
 
         {/* Instances */}
         {state["drag-instance-1"] && (
           <div className="text-center">
             <div className="text-xs text-muted-foreground mb-1">인스턴스 1</div>
             {renderSimulatorElement(
               "override-text",
               <div className={cn(
                 "px-6 py-3 font-semibold transition-all duration-300",
                 state["change-color-purple"] ? "bg-purple-500" : "bg-primary",
                 state["corner-radius-0"] ? "rounded-none" : "rounded-xl",
                 "text-white"
               )}>
                 <div className="flex items-center gap-1">
                   <span className="opacity-50">◇</span>
                   {state["reset-overrides"] ? (state["component-name"] || "버튼") : (state["override-text"] || state["component-name"] || "버튼")}
                 </div>
               </div>
             )}
           </div>
         )}
 
         {state["drag-instance-2"] && (
           <div className="text-center">
             <div className="text-xs text-muted-foreground mb-1">인스턴스 2</div>
             <div className={cn(
               "px-6 py-3 font-semibold transition-all duration-300",
               state["change-color-purple"] ? "bg-purple-500" : "bg-primary",
               state["corner-radius-0"] ? "rounded-none" : "rounded-xl",
               "text-white"
             )}>
               <div className="flex items-center gap-1">
                 <span className="opacity-50">◇</span>
                 {state["component-name"] || "버튼"}
               </div>
             </div>
           </div>
         )}
 
         {!state["create-component"] && renderSimulatorElement(
           "select-button",
           <div className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">버튼</div>
         )}
       </div>
 
       {/* Right Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">컴포넌트</div>
 
         {state["select-button"] && renderSimulatorElement(
           "create-component",
           <Button size="sm" className="w-full gap-1">◆ 컴포넌트 만들기</Button>
         )}
         {state["create-component"] && renderSimulatorElement(
           "component-name",
           <div className="p-2 bg-card rounded text-sm">이름 변경</div>
         )}
         {state["component-name"] && renderSimulatorElement(
           "drag-instance-1",
           <Button variant="outline" size="sm" className="w-full">인스턴스 1 배치</Button>
         )}
         {state["drag-instance-1"] && renderSimulatorElement(
           "drag-instance-2",
           <Button variant="outline" size="sm" className="w-full">인스턴스 2 배치</Button>
         )}
         {state["select-main"] && renderSimulatorElement(
           "change-color-purple",
           <div className="flex gap-1 p-2 bg-card rounded">
             <div className="w-5 h-5 rounded bg-purple-500 ring-2 ring-primary" />
             <div className="w-5 h-5 rounded bg-blue-500" />
             <div className="w-5 h-5 rounded bg-green-500" />
           </div>
         )}
         {state["change-color-purple"] && renderSimulatorElement(
           "corner-radius-0",
           <div className="p-2 bg-card rounded text-sm">모서리: 0px</div>
         )}
         {state["override-text"] && renderSimulatorElement(
           "reset-overrides",
           <Button variant="outline" size="sm" className="w-full text-xs">오버라이드 초기화</Button>
         )}
       </div>
     </div>
   );
 
   const renderDay8Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Mode Toggle */}
       <div className="w-24 bg-muted/30 rounded-lg p-2 flex flex-col gap-2">
         <div className="text-xs text-muted-foreground mb-1">모드</div>
         {renderSimulatorElement(
           "prototype-mode",
           <div className={cn(
             "p-2 rounded text-sm text-center transition-all",
             state["prototype-mode"] ? "bg-primary text-primary-foreground" : "bg-card"
           )}>
             프로토타입
           </div>
         )}
       </div>
 
       {/* Canvas with Frames */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center gap-8 relative">
         {renderSimulatorElement(
           "select-frame-1",
           <div className={cn(
             "w-32 h-48 bg-card rounded-lg border-2 flex items-center justify-center transition-all",
             state["select-frame-1"] && "border-primary"
           )}>
             <div className="text-center">
               <div className="text-2xl mb-1">🏠</div>
               <div className="text-xs">프레임 1</div>
             </div>
             {state["connection-node"] && renderSimulatorElement(
               "connect-to-frame-2",
               <div className="absolute -right-2 top-1/2 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-xs">+</div>
             )}
           </div>
         )}
 
         {/* Connection Wire */}
         {state["connect-to-frame-2"] && (
           <div className="w-16 h-0.5 bg-primary" />
         )}
 
         <div className={cn(
           "w-32 h-48 bg-card rounded-lg border-2 flex items-center justify-center transition-all",
           state["connect-to-frame-2"] && "border-primary"
         )}>
           <div className="text-center">
             <div className="text-2xl mb-1">📄</div>
             <div className="text-xs">프레임 2</div>
           </div>
         </div>
 
         {/* Play Preview */}
         {state["duration-300"] && renderSimulatorElement(
           "play-preview",
           <Button size="icon" className="absolute top-2 right-2">▶</Button>
         )}
       </div>
 
       {/* Right Panel - Interaction Settings */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">인터랙션</div>
 
         {state["select-frame-1"] && renderSimulatorElement(
           "connection-node",
           <div className="p-2 bg-card rounded text-sm text-center">
             <div className="w-6 h-6 bg-primary rounded-full mx-auto flex items-center justify-center text-white">+</div>
             <span className="text-xs">연결 노드</span>
           </div>
         )}
 
         {state["connect-to-frame-2"] && (
           <>
             {renderSimulatorElement(
               "trigger-click",
               <div className="p-2 bg-card rounded text-sm flex justify-between">
                 <span>트리거</span>
                 <span className="text-primary">{state["trigger-click"] ? "클릭 시" : "선택..."}</span>
               </div>
             )}
             {state["trigger-click"] && renderSimulatorElement(
               "action-navigate",
               <div className="p-2 bg-card rounded text-sm flex justify-between">
                 <span>액션</span>
                 <span className="text-primary">{state["action-navigate"] ? "다음으로 이동" : "선택..."}</span>
               </div>
             )}
             {state["action-navigate"] && renderSimulatorElement(
               "smart-animate",
               <div className="p-2 bg-card rounded text-sm flex justify-between">
                 <span>애니메이션</span>
                 <span className="text-primary">{state["smart-animate"] ? "스마트 애니메이트" : "없음"}</span>
               </div>
             )}
             {state["smart-animate"] && renderSimulatorElement(
               "easing-out",
               <div className="p-2 bg-card rounded text-sm flex justify-between">
                 <span>이징</span>
                 <span className="text-primary">{state["easing-out"] ? "Ease Out" : "Linear"}</span>
               </div>
             )}
             {state["easing-out"] && renderSimulatorElement(
               "duration-300",
               <div className="p-2 bg-card rounded text-sm">
                 <div className="flex justify-between mb-2">
                   <span>지속 시간</span>
                   <span>{sliderValue[0]}ms</span>
                 </div>
               </div>
             )}
           </>
         )}
       </div>
     </div>
   );
 
   const renderDay9Canvas = () => (
     <div className="flex gap-4 h-full">
       {/* Canvas */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex flex-col">
         {/* Desktop Frame */}
         {state["create-desktop"] && (
           <div className="w-full h-full border-2 border-dashed border-border rounded-lg relative">
             {/* Grid Overlay */}
             {state["add-grid"] && (
               <div className="absolute inset-0 grid grid-cols-12 gap-2 p-2 opacity-20">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="bg-primary/30 h-full rounded" />
                 ))}
               </div>
             )}
 
             {/* Header */}
             <div className={cn(
               "flex items-center h-16 px-4 border-b",
               state["autolayout-header"] && "justify-between",
               state["pin-top"] && "bg-card shadow-sm"
             )}>
               {state["place-logo"] && (
                 <div className={cn(
                   "font-bold text-lg",
                   state["group-logo-menu"] && "flex items-center gap-4"
                 )}>
                   🏠 로고
                   {state["group-logo-menu"] && state["place-menu"] && (
                     <div className="flex gap-4 text-sm font-normal">
                       <span>홈</span>
                       <span>소개</span>
                       <span>서비스</span>
                     </div>
                   )}
                 </div>
               )}
               {state["place-menu"] && !state["group-logo-menu"] && (
                 <div className="flex gap-4 text-sm mx-auto">
                   <span>홈</span>
                   <span>소개</span>
                   <span>서비스</span>
                 </div>
               )}
               {state["place-login"] && (
                 <Button size="sm">로그인</Button>
               )}
             </div>
           </div>
         )}
 
         {!state["create-desktop"] && renderSimulatorElement(
           "create-desktop",
           <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center text-primary">
             클릭하여 데스크탑 프레임 생성
           </div>
         )}
       </div>
 
       {/* Right Panel */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">레이아웃</div>
 
         {state["create-desktop"] && renderSimulatorElement(
           "add-grid",
           <Button variant="outline" size="sm" className="w-full">그리드 추가</Button>
         )}
         {state["add-grid"] && renderSimulatorElement(
           "place-logo",
           <Button variant="outline" size="sm" className="w-full">로고 배치 (왼쪽)</Button>
         )}
         {state["place-logo"] && renderSimulatorElement(
           "place-menu",
           <Button variant="outline" size="sm" className="w-full">메뉴 배치 (중앙)</Button>
         )}
         {state["place-menu"] && renderSimulatorElement(
           "place-login",
           <Button variant="outline" size="sm" className="w-full">로그인 버튼 (오른쪽)</Button>
         )}
         {state["place-login"] && renderSimulatorElement(
           "group-logo-menu",
           <Button variant="outline" size="sm" className="w-full">로고+메뉴 그룹</Button>
         )}
         {state["group-logo-menu"] && renderSimulatorElement(
           "autolayout-header",
           <Button size="sm" className="w-full">오토 레이아웃 적용</Button>
         )}
         {state["autolayout-header"] && renderSimulatorElement(
           "space-between",
           <div className="p-2 bg-card rounded text-sm">간격: Space Between</div>
         )}
         {state["space-between"] && renderSimulatorElement(
           "fill-container",
           <div className="p-2 bg-card rounded text-sm">너비: Fill Container</div>
         )}
         {state["fill-container"] && renderSimulatorElement(
           "pin-top",
           <div className="p-2 bg-card rounded text-sm">제약: 상단 고정 📌</div>
         )}
       </div>
     </div>
   );
 
   const renderDay10Canvas = () => (
     <div className="flex gap-4 h-full relative">
       {/* Confetti */}
       {showConfetti && (
         <div className="absolute inset-0 pointer-events-none z-50">
           {[...Array(30)].map((_, i) => (
             <div
               key={i}
               className="absolute animate-bounce text-2xl"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 animationDelay: `${Math.random() * 0.5}s`,
                 animationDuration: `${0.5 + Math.random() * 0.5}s`,
               }}
             >
               {["🎉", "✨", "🎊", "⭐", "🌟", "🏆"][Math.floor(Math.random() * 6)]}
             </div>
           ))}
         </div>
       )}
 
       {/* Canvas - Final Design Preview */}
       <div className="flex-1 bg-muted/20 rounded-lg p-4 flex items-center justify-center">
         {renderSimulatorElement(
           "select-desktop",
           <div className="w-full max-w-md bg-card rounded-xl border shadow-lg overflow-hidden">
             {/* Header */}
             <div className="flex items-center justify-between p-4 border-b">
               <div className="font-bold">🏠 GrowIt</div>
               <div className="flex gap-4 text-sm">
                 <span>홈</span>
                 <span>소개</span>
                 <span>연락처</span>
               </div>
               <Button size="sm">로그인</Button>
             </div>
             {/* Content */}
             <div className="p-8 text-center">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                 <Sparkles className="w-8 h-8 text-primary" />
               </div>
               <h3 className="font-bold text-lg mb-2">완성된 디자인</h3>
               <p className="text-sm text-muted-foreground">10일 Figma 챌린지 수료</p>
             </div>
           </div>
         )}
 
         {/* Certificate Badge */}
         {showConfetti && (
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-xl animate-scale-in">
             🏆 Figma 디자이너 인증
           </div>
         )}
       </div>
 
       {/* Right Panel - Export */}
       <div className="w-56 bg-muted/30 rounded-lg p-3 flex flex-col gap-2">
         <div className="text-xs font-semibold text-muted-foreground mb-2">내보내기</div>
 
         {state["select-desktop"] && renderSimulatorElement(
           "export-section",
           <div className="p-2 bg-card rounded text-sm font-medium">Export 섹션</div>
         )}
         {state["export-section"] && renderSimulatorElement(
           "add-export",
           <Button variant="outline" size="sm" className="w-full">+ 형식 추가</Button>
         )}
         {state["add-export"] && renderSimulatorElement(
           "scale-2x",
           <div className="p-2 bg-card rounded text-sm flex justify-between">
             <span>배율</span>
             <span className="text-primary">{state["scale-2x"] ? "2x" : "1x"}</span>
           </div>
         )}
         {state["scale-2x"] && renderSimulatorElement(
           "add-export-2",
           <Button variant="outline" size="sm" className="w-full">+ 형식 추가</Button>
         )}
         {state["add-export-2"] && renderSimulatorElement(
           "suffix-2x",
           <div className="p-2 bg-card rounded text-sm">접미사 설정</div>
         )}
         {state["suffix-2x"] && renderSimulatorElement(
           "format-jpg",
           <div className="p-2 bg-card rounded text-sm flex justify-between">
             <span>형식</span>
             <span className="text-primary">{state["format-jpg"] ? "JPG" : "PNG"}</span>
           </div>
         )}
         {state["format-jpg"] && renderSimulatorElement(
           "preview-export",
           <Button variant="outline" size="sm" className="w-full">미리보기</Button>
         )}
         {state["preview-export"] && renderSimulatorElement(
           "export-frame",
           <Button size="sm" className="w-full">프레임 내보내기</Button>
         )}
         {state["export-frame"] && renderSimulatorElement(
           "final-celebration",
           <Button variant="success" size="sm" className="w-full animate-pulse">🎉 완료!</Button>
         )}
       </div>
     </div>
   );
 
   const renderCanvas = () => {
     switch (config.day) {
       case 1: return renderDay1Canvas();
       case 2: return renderDay2Canvas();
       case 3: return renderDay3Canvas();
       case 4: return renderDay4Canvas();
       case 5: return renderDay5Canvas();
       case 6: return renderDay6Canvas();
       case 7: return renderDay7Canvas();
       case 8: return renderDay8Canvas();
       case 9: return renderDay9Canvas();
       case 10: return renderDay10Canvas();
       default: return renderDay1Canvas();
     }
   };
 
   return (
     <div className="rounded-2xl border border-border bg-card overflow-hidden">
       {/* Progress Header */}
       <div className="bg-muted/50 p-4 border-b">
         <div className="flex items-center justify-between mb-3">
           <div>
             <h3 className="text-lg font-semibold">{config.title}</h3>
             <p className="text-sm text-muted-foreground">{config.subtitle}</p>
           </div>
           <div className="text-right">
             <div className="text-2xl font-bold text-primary">
               {currentStep}/{totalSteps}
             </div>
             <div className="text-xs text-muted-foreground">단계 완료</div>
           </div>
         </div>
         <Progress value={progress} className="h-2" />
       </div>
 
       {/* Instruction */}
       <div className="p-4 bg-primary/5 border-b">
         <div className="flex items-center gap-3">
           {isComplete ? (
             <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
           ) : (
             <Circle className="w-6 h-6 text-primary flex-shrink-0" />
           )}
           <div>
             <div className="text-xs text-muted-foreground mb-0.5">
               {isComplete ? "모든 단계 완료!" : `단계 ${currentStep + 1}`}
             </div>
             <p className="font-medium">
               {isComplete ? "🎉 훌륭해요! 오늘의 미션을 완료했습니다!" : currentStepData?.instruction}
             </p>
           </div>
         </div>
       </div>
 
       {/* Input Area (for input/slider actions) */}
       {currentStepData?.action === "input" && (
         <div className="p-4 border-b bg-muted/30 flex gap-2">
           <Input
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             placeholder={currentStepData.inputPlaceholder}
             className="flex-1"
             onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
           />
           <Button onClick={handleInputSubmit} disabled={!inputValue.trim()}>
             확인
           </Button>
         </div>
       )}
 
       {currentStepData?.action === "slider" && currentStepData.sliderConfig && (
         <div className="p-4 border-b bg-muted/30">
           <div className="flex items-center gap-4">
             <Slider
               value={sliderValue}
               onValueChange={setSliderValue}
               min={currentStepData.sliderConfig.min}
               max={currentStepData.sliderConfig.max}
               step={1}
               className="flex-1"
             />
             <span className="text-sm font-medium w-12 text-right">{sliderValue[0]}</span>
             <Button onClick={handleSliderSubmit} size="sm">
               적용
             </Button>
           </div>
         </div>
       )}
 
       {/* Simulator Canvas */}
       <div className="p-4 min-h-[360px]">
         {renderCanvas()}
       </div>
 
       {/* Completion */}
       {isComplete && (
         <div className="p-4 border-t bg-success/10">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                 <CheckCircle2 className="w-6 h-6 text-success-foreground" />
               </div>
               <div>
                 <p className="font-semibold text-success">Day {config.day} 완료!</p>
                 <p className="text-sm text-muted-foreground">다음 도전으로 넘어가세요</p>
               </div>
             </div>
             <Button onClick={onComplete} variant="success">
               미션 완료
             </Button>
           </div>
         </div>
       )}
 
       {/* Step Indicators */}
       <div className="p-4 border-t bg-muted/30">
         <div className="flex gap-1">
           {config.steps.map((step, index) => (
             <div
               key={step.id}
               className={cn(
                 "flex-1 h-1.5 rounded-full transition-all duration-300",
                 index < currentStep ? "bg-success" :
                 index === currentStep ? "bg-primary animate-pulse" :
                 "bg-muted"
               )}
             />
           ))}
         </div>
       </div>
     </div>
   );
 }