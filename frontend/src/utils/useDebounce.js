// utils/useDebounce.js
import { useState, useEffect } from "react";

/**
 * Native debounce hook (400-500ms).
 * Cancels previous calls.
 * If value < 2 chars, returns empty string immediately to prevent API calls.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    // Return empty if less than 2 chars (as requested: "no call if < 2 chars")
    if (value.trim().length > 0 && value.trim().length < 2) {
      setDebouncedValue("");
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
