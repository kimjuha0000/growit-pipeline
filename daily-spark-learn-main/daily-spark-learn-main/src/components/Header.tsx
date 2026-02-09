import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export function Header() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">G</span>
          </div>
          <span className="font-bold text-xl text-foreground">GrowIt</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <LanguageToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/curriculum")}
          >
            {t(translations.header.learn)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            {t(translations.header.login)}
          </Button>
        </nav>
      </div>
    </header>
  );
}
