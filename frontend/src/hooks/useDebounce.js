import { useState, useEffect } from "react";

/**
 * Custom hook to debounce any rapidly changing value (e.g. text input for notes).
 * Returns the debounced value after delay (default 500ms).
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
