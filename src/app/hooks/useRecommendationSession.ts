"use client";

import { useCallback, useEffect, useState } from "react";
import { generateSessionId } from "../utils/session";

export const useRecommendationSession = () => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  const refreshSession = useCallback(() => {
    const nextSessionId = generateSessionId();
    setSessionId(nextSessionId);
    return nextSessionId;
  }, []);

  return { sessionId, refreshSession };
};
