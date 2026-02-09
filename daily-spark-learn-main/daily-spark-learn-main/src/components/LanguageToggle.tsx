import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
      className="gap-1.5 font-medium text-sm"
    >
      {language === 'ko' ? (
        <>
          <span className="text-base">🇰🇷</span>
          <span>KO</span>
        </>
      ) : (
        <>
          <span className="text-base">🇺🇸</span>
          <span>EN</span>
        </>
      )}
    </Button>
  );
}
