import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface CourseOption {
  id: string;
  icon: string;
  status: "active" | "locked";
  color: string;
}

const courseOptions: CourseOption[] = [
  { 
    id: 'figma', 
    icon: '🎨', 
    status: 'active',
    color: 'bg-purple-600'
  },
  { 
    id: 'excel', 
    icon: '📊', 
    status: 'locked',
    color: 'bg-green-600'
  },
  { 
    id: 'ppt', 
    icon: '💼', 
    status: 'locked',
    color: 'bg-orange-600'
  }
];

interface CourseSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCourse: (courseId: string) => void;
}

export function CourseSelectionModal({ open, onOpenChange, onSelectCourse }: CourseSelectionModalProps) {
  const { t } = useLanguage();

  const getCourseContent = (id: string) => {
    const courses = translations.courses as Record<string, { title: { ko: string; en: string }; description: { ko: string; en: string }; badge: { ko: string; en: string } }>;
    return courses[id];
  };

  const handleCardClick = (course: CourseOption) => {
    if (course.status === "active") {
      onSelectCourse(course.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            {t(translations.courseModal.title)}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {t(translations.courseModal.subtitle)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2 space-y-3">
          {courseOptions.map((course) => {
            const content = getCourseContent(course.id);
            return (
              <div
                key={course.id}
                onClick={() => handleCardClick(course)}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200",
                  course.status === "active" 
                    ? "border-primary bg-card shadow-md cursor-pointer hover:shadow-lg animate-pulse-subtle" 
                    : "border-border bg-muted/30 opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0",
                    course.status === "active" ? course.color : "bg-muted"
                  )}>
                    {course.status === "locked" ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      course.icon
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "font-semibold text-lg",
                        course.status === "locked" && "text-muted-foreground"
                      )}>
                        {t(content.title)}
                      </h3>
                      <Badge 
                        variant={course.status === "active" ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          course.status === "active" && "bg-primary text-primary-foreground"
                        )}
                      >
                        {t(content.badge)}
                      </Badge>
                    </div>
                    <p className={cn(
                      "text-sm",
                      course.status === "active" ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}>
                      {t(content.description)}
                    </p>
                  </div>

                  {/* Arrow for active */}
                  {course.status === "active" && (
                    <ArrowRight className="w-5 h-5 text-primary shrink-0 mt-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            {t(translations.courseModal.footer)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
