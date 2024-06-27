import { useCallback, useMemo, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const itemObject = window.localStorage.getItem(`${key}`);
      if (itemObject) {
        const parsed = JSON.parse(itemObject);

        return parsed.value;
      }

      return initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(
        `${key}`,
        JSON.stringify({ value: valueToStore })
      );
    },
    [key, storedValue]
  );

  return useMemo(() => [storedValue, setValue], [setValue, storedValue]);
}
