import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">G</span>
          </div>
          <span className="font-bold text-xl text-foreground">GrowIt</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/curriculum")}
          >
            학습하기
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            로그인
          </Button>
        </nav>
      </div>
    </header>
  );
}
