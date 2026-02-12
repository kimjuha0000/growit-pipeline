import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { sendEvent } from "@/lib/logger";
import Auth from "@/components/Auth";
import Index from "./pages/Index";
import Curriculum from "./pages/Curriculum";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const TRACKABLE_SELECTOR = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "form",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='tab']",
  "[data-analytics-id]",
].join(",");
const MAX_METADATA_TEXT_LENGTH = 120;

function normalizeText(value: string | null | undefined, maxLength = MAX_METADATA_TEXT_LENGTH): string | null {
  if (!value) return null;
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return null;
  return compact.length > maxLength ? compact.slice(0, maxLength) : compact;
}

function buildDomPath(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;

  for (let depth = 0; current && depth < 4; depth += 1) {
    const tag = current.tagName.toLowerCase();
    if (current.id) {
      parts.push(`${tag}#${current.id}`);
      break;
    }

    const className = current.getAttribute("class");
    const classPart = className
      ? className
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .join(".")
      : "";
    parts.push(classPart ? `${tag}.${classPart}` : tag);
    current = current.parentElement;
  }

  return parts.join(" > ");
}

function getTrackableElement(target: EventTarget | null): Element | null {
  if (!(target instanceof Node)) return null;
  const element = target instanceof Element ? target : target.parentElement;
  if (!element) return null;
  return element.closest(TRACKABLE_SELECTOR) ?? element;
}

function buildInteractionMetadata(event: Event, element: Element): Record<string, unknown> {
  const metadata: Record<string, unknown> = {
    dom_event: event.type,
    path: window.location.pathname,
    search: window.location.search || null,
    tag: element.tagName.toLowerCase(),
    id: normalizeText(element.getAttribute("id"), 64),
    role: normalizeText(element.getAttribute("role"), 40),
    name: normalizeText(element.getAttribute("name"), 64),
    analytics_id: normalizeText(element.getAttribute("data-analytics-id"), 64),
    aria_label: normalizeText(element.getAttribute("aria-label")),
    dom_path: buildDomPath(element),
  };

  if (element instanceof HTMLAnchorElement) {
    metadata.href = normalizeText(element.getAttribute("href"), 200);
    metadata.text = normalizeText(element.textContent);
  } else if (element instanceof HTMLInputElement) {
    metadata.input_type = element.type;
    metadata.placeholder = normalizeText(element.placeholder);
    if (element.type === "checkbox" || element.type === "radio") {
      metadata.checked = element.checked;
    }
  } else if (element instanceof HTMLTextAreaElement) {
    metadata.placeholder = normalizeText(element.placeholder);
  } else if (element instanceof HTMLSelectElement) {
    metadata.options_count = element.options.length;
  } else if (element instanceof HTMLFormElement) {
    metadata.form_action = normalizeText(element.getAttribute("action"), 200);
    metadata.form_method = normalizeText(element.getAttribute("method"), 16);
  } else {
    metadata.text = normalizeText(element.textContent);
  }

  return Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== null && value !== ""));
}

function GlobalUiEventTracker() {
  useEffect(() => {
    const handleDomEvent = (event: Event) => {
      if (!event.isTrusted) return;

      const element = getTrackableElement(event.target);
      if (!element) return;
      if (element.closest("[data-analytics-ignore='true']")) return;

      void sendEvent(`ui_${event.type}`, buildInteractionMetadata(event, element));
    };

    const events: Array<keyof DocumentEventMap> = ["click", "change", "submit"];
    for (const eventName of events) {
      document.addEventListener(eventName, handleDomEvent, true);
    }

    return () => {
      for (const eventName of events) {
        document.removeEventListener(eventName, handleDomEvent, true);
      }
    };
  }, []);

  return null;
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    void sendEvent("page_view", {
      path: location.pathname,
      search: location.search,
      referrer: document.referrer || null,
    });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteChangeTracker />
              <GlobalUiEventTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/curriculum" element={<Curriculum />} />
                <Route path="/learn/:curriculumId/:day" element={<Learn />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
