"use client";

import { useEffect, useRef } from "react";
import { enqueueTrackingEvent } from "../services/trackingClient";

type ImpressionTrackingOptions = {
  enabled: boolean;
  contentType: "BOOK" | "REVIEW" | "USER";
  contentId: string;
  source: string;
  position?: number;
  rank?: number | null;
  score?: number | null;
  requestId?: string;
  algorithm?: string;
  metadata?: Record<string, unknown>;
};

export function useImpressionTracking(options: ImpressionTrackingOptions) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const sentRef = useRef(false);

  useEffect(() => {
    if (!options.enabled) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            startTimeRef.current = Date.now();
          } else if (startTimeRef.current && !sentRef.current) {
            const visibilityMs = Date.now() - startTimeRef.current;
            if (visibilityMs >= 1000) {
              enqueueTrackingEvent({
                eventType: "IMPRESSION",
                source: options.source,
                contentType: options.contentType,
                contentId: options.contentId,
                position: options.position,
                rank: options.rank ?? undefined,
                score: options.score ?? undefined,
                requestId: options.requestId,
                algorithm: options.algorithm,
                visibilityMs,
                metadata: options.metadata,
              });
              sentRef.current = true;
            }
            startTimeRef.current = null;
          }
        });
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (startTimeRef.current && !sentRef.current) {
        const visibilityMs = Date.now() - startTimeRef.current;
        if (visibilityMs >= 1000) {
          enqueueTrackingEvent({
            eventType: "IMPRESSION",
            source: options.source,
            contentType: options.contentType,
            contentId: options.contentId,
            position: options.position,
            rank: options.rank ?? undefined,
            score: options.score ?? undefined,
            requestId: options.requestId,
            algorithm: options.algorithm,
            visibilityMs,
            metadata: options.metadata,
          });
        }
      }
    };
  }, [options]);

  return elementRef;
}
