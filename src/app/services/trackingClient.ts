"use client";

import { apiFetch } from "./apiClient";

type TrackingEventRequest = {
  eventId: string;
  eventType: string;
  sessionId?: string;
  deviceId?: string;
  clientTime?: string;
  source?: string;
  contentType: string;
  contentId: string;
  position?: number;
  rank?: number;
  score?: number | null;
  requestId?: string;
  algorithm?: string;
  dwellMs?: number;
  scrollDepthPct?: number;
  visibilityMs?: number;
  metadata?: Record<string, unknown>;
};

type TrackingEventsRequest = {
  events: TrackingEventRequest[];
};

const MAX_BATCH_SIZE = 10;
const FLUSH_INTERVAL_MS = 5_000;
const SESSION_KEY = "bv_session_id";
const DEVICE_KEY = "bv_device_id";

let queue: TrackingEventRequest[] = [];
let flushTimer: number | null = null;
let initialized = false;

const getOrCreateId = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) {
    return existing;
  }
  const next =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  storage.setItem(key, next);
  return next;
};

const getSessionId = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return getOrCreateId(window.sessionStorage, SESSION_KEY);
};

const getDeviceId = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return getOrCreateId(window.localStorage, DEVICE_KEY);
};

const initTracking = () => {
  if (initialized || typeof window === "undefined") {
    return;
  }
  initialized = true;

  const flushOnHide = () => {
    if (document.visibilityState === "hidden") {
      flushTrackingEvents(true);
    }
  };

  window.addEventListener("visibilitychange", flushOnHide);
  window.addEventListener("pagehide", () => flushTrackingEvents(true));
};

export const enqueueTrackingEvent = (
  event: Omit<TrackingEventRequest, "eventId" | "sessionId" | "deviceId" | "clientTime">,
) => {
  initTracking();
  const payload: TrackingEventRequest = {
    eventId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sessionId: getSessionId(),
    deviceId: getDeviceId(),
    clientTime: new Date().toISOString(),
    ...event,
  };

  queue = [...queue, payload];
  if (queue.length >= MAX_BATCH_SIZE) {
    void flushTrackingEvents();
    return;
  }
  if (flushTimer) {
    window.clearTimeout(flushTimer);
  }
  flushTimer = window.setTimeout(() => {
    void flushTrackingEvents();
  }, FLUSH_INTERVAL_MS);
};

export const flushTrackingEvents = async (useBeacon = false) => {
  if (queue.length === 0) {
    return;
  }

  if (flushTimer) {
    window.clearTimeout(flushTimer);
    flushTimer = null;
  }

  const batch = queue.slice(0, MAX_BATCH_SIZE);
  queue = queue.slice(batch.length);

  const body: TrackingEventsRequest = { events: batch };
  if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], {
      type: "application/json",
    });
    navigator.sendBeacon("/api/tracking/events", blob);
    return;
  }

  try {
    await apiFetch("/api/tracking/events", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch {
    // Intentionally drop failed batches to avoid retry loops.
  }
};
