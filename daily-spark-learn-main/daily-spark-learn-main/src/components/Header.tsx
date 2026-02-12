import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Clock3, Flame } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { sendEvent } from "@/lib/logger";

export function Header() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  // TODO: reconnect with backend user stats API when implemented.
  const dailyStudyMinutes = 0;
  const currentStreak = 0;
  
  const handleLogoClick = () => {
    void sendEvent("header_nav_click", {
      target: "home",
      component: "Header",
    });
  };

  const handleCurriculumClick = () => {
    void sendEvent("header_nav_click", {
      target: "curriculum",
      component: "Header",
      button_text: t(translations.header.learn),
    });
    navigate("/curriculum");
  };

  const handleAuthClick = () => {
    void sendEvent("header_nav_click", {
      target: "auth",
      component: "Header",
      button_text: t(translations.header.login),
    });
    navigate("/auth");
  };

  const handleSignOutClick = () => {
    void sendEvent("header_nav_click", {
      target: "signout",
      component: "Header",
      button_text: t({ ko: "로그아웃", en: "Logout" }),
    });
    logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2">
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
            onClick={handleCurriculumClick}
          >
            {t(translations.header.learn)}
          </Button>
          {user && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                <span className="hidden md:inline">오늘</span>
                <span className="font-semibold text-foreground">{dailyStudyMinutes}분</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-semibold text-foreground">{currentStreak}일</span>
              </span>
            </div>
          )}
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOutClick}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t({ ko: "로그아웃", en: "Logout" })}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthClick}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              {t(translations.header.login)}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
