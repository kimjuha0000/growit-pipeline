import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface Day9GameProps {
  onComplete: () => void;
}

type ItemType = "logo" | "menu" | "login";

interface DraggableItem {
  id: ItemType;
  label: string;
  placed: boolean;
}

export function Day9Game({ onComplete }: Day9GameProps) {
  const [items, setItems] = useState<DraggableItem[]>([
    { id: "logo", label: "🏠 로고", placed: false },
    { id: "menu", label: "📋 메뉴", placed: false },
    { id: "login", label: "👤 로그인", placed: false },
  ]);

  const [headerItems, setHeaderItems] = useState<ItemType[]>([]);
  const [draggingItem, setDraggingItem] = useState<ItemType | null>(null);

  const handleDragStart = (itemId: ItemType) => {
    setDraggingItem(itemId);
  };

  const handleDrop = () => {
    if (!draggingItem) return;
    
    if (!headerItems.includes(draggingItem)) {
      setHeaderItems([...headerItems, draggingItem]);
      setItems(items.map(item => 
        item.id === draggingItem ? { ...item, placed: true } : item
      ));
    }
    setDraggingItem(null);
  };

  const handleItemClick = (itemId: ItemType) => {
    if (items.find(i => i.id === itemId)?.placed) return;
    
    if (!headerItems.includes(itemId)) {
      setHeaderItems([...headerItems, itemId]);
      setItems(items.map(item => 
        item.id === itemId ? { ...item, placed: true } : item
      ));
    }
  };

  const isComplete = headerItems.length === 3;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🏰 성 설계도</h3>
        <p className="text-sm text-muted-foreground">
          컴포넌트를 배치해서 웹사이트 헤더를 만들어보세요!
        </p>
      </div>

      {/* Header Preview */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`bg-card border-2 rounded-xl p-4 min-h-[64px] mb-6 flex items-center transition-all duration-200 ${
          draggingItem ? "border-primary border-dashed bg-primary/5" : "border-border"
        }`}
      >
        {headerItems.length === 0 ? (
          <p className="text-sm text-muted-foreground w-full text-center">
            아이템을 드래그하거나 클릭해서 여기에 배치하세요
          </p>
        ) : (
          <div className="flex items-center justify-between w-full">
            {headerItems.includes("logo") && (
              <div className="font-bold text-lg animate-fade-in">🏠 GrowIt</div>
            )}
            {headerItems.includes("menu") && (
              <div className="flex gap-4 text-sm animate-fade-in">
                <span className="text-muted-foreground hover:text-foreground cursor-pointer">홈</span>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer">소개</span>
                <span className="text-muted-foreground hover:text-foreground cursor-pointer">연락처</span>
              </div>
            )}
            {headerItems.includes("login") && (
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium animate-fade-in">
                로그인
              </button>
            )}
          </div>
        )}
      </div>

      {/* Draggable Items */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">
          사용 가능한 컴포넌트:
        </label>
        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              draggable={!item.placed}
              onDragStart={() => handleDragStart(item.id)}
              onClick={() => handleItemClick(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                item.placed
                  ? "bg-muted text-muted-foreground border-muted cursor-default"
                  : "bg-card border-border cursor-grab hover:border-primary hover:translate-y-[-2px] active:cursor-grabbing"
              }`}
            >
              {!item.placed && <GripVertical className="w-4 h-4 text-muted-foreground" />}
              <span className="font-medium">{item.label}</span>
              {item.placed && <span className="text-success">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 animate-fade-in">
          <p className="text-success font-medium mb-3">
            🎨 완벽한 네비게이션 헤더를 만들었어요!
          </p>
          <Button onClick={onComplete} variant="success">
            미션 완료
          </Button>
        </div>
      )}
    </div>
  );
}
