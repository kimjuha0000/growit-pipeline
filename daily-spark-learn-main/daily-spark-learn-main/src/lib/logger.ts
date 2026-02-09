type EventMetadata = Record<string, unknown>;

const ANONYMOUS_ID_KEY = "growit_anonymous_id";
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");

function createAnonymousId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") {
    return createAnonymousId();
  }

  const saved = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (saved) {
    return saved;
  }

  const newId = createAnonymousId();
  window.localStorage.setItem(ANONYMOUS_ID_KEY, newId);
  return newId;
}

export async function sendEvent(eventName: string, metadata: EventMetadata = {}): Promise<void> {
  if (typeof window === "undefined") return;
  if (!API_BASE_URL) return;

  const payload = {
    event_type: eventName,
    anonymous_id: getAnonymousId(),
    metadata,
  };

  try {
    await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to send analytics event", { eventName, error });
    }
  }
}
