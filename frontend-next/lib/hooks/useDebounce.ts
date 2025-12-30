import { useState, useEffect } from "react";

/**
 * Debounce hook - delays updating a value until after a specified delay
 * Useful for search inputs, window resize handlers, etc.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState("");
 * const debouncedSearch = useDebounce(searchQuery, 300);
 *
 * useEffect(() => {
 *   // This only runs when debouncedSearch changes (after 300ms of no typing)
 *   fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

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

export default useDebounce;
