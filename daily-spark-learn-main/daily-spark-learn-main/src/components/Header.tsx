import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Clock3, Flame } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { sendEvent } from "@/lib/logger";

type StudyStats = {
  current_streak: number;
  today_study_minutes: number;
  total_study_minutes: number;
  last_study_date: string | null;
};

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const STUDY_STATS_REFRESH_EVENT = "study-stats:refresh";
const EMPTY_STUDY_STATS: StudyStats = {
  current_streak: 0,
  today_study_minutes: 0,
  total_study_minutes: 0,
  last_study_date: null,
};

const buildApiUrl = (path: string): string => {
  const fallbackBase = typeof window !== "undefined" ? window.location.origin : "";
  const baseUrl = API_BASE_URL || fallbackBase;
  return `${baseUrl}${path}`;
};

export function Header() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, token, logout } = useAuth();
  const [studyStats, setStudyStats] = useState<StudyStats>(EMPTY_STUDY_STATS);

  const fetchStudyStats = useCallback(async () => {
    if (!user || !token) {
      setStudyStats(EMPTY_STUDY_STATS);
      return;
    }

    try {
      const response = await fetch(buildApiUrl("/api/study/stats"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setStudyStats(EMPTY_STUDY_STATS);
        return;
      }

      const payload = (await response.json()) as StudyStats;
      setStudyStats({
        current_streak: payload.current_streak ?? 0,
        today_study_minutes: payload.today_study_minutes ?? 0,
        total_study_minutes: payload.total_study_minutes ?? 0,
        last_study_date: payload.last_study_date ?? null,
      });
    } catch {
      setStudyStats(EMPTY_STUDY_STATS);
    }
  }, [token, user]);

  useEffect(() => {
    void fetchStudyStats();
  }, [fetchStudyStats]);

  useEffect(() => {
    const handleRefresh = () => {
      void fetchStudyStats();
    };

    window.addEventListener(STUDY_STATS_REFRESH_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(STUDY_STATS_REFRESH_EVENT, handleRefresh);
    };
  }, [fetchStudyStats]);

  const dailyStudyMinutes = studyStats.today_study_minutes;
  const currentStreak = studyStats.current_streak;
  
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
    setStudyStats(EMPTY_STUDY_STATS);
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
