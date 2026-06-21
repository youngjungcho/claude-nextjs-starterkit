"use client";

import { useEffect, useReducer } from "react";

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type Action<T> =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_ERROR"; payload: Error };

function reducer<T>(state: UseFetchState<T>, action: Action<T>): UseFetchState<T> {
  switch (action.type) {
    case "FETCH_START":
      return { data: null, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

/**
 * 간단한 데이터 페칭 훅. 외부 의존성 없이 fetch API를 래핑합니다.
 * 복잡한 서버 상태 관리가 필요하면 TanStack Query 도입을 권장합니다.
 * @example
 * const { data, loading, error } = useFetch<User[]>("/api/users");
 */
export function useFetch<T>(url: string | null): UseFetchState<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    dispatch({ type: "FETCH_START" });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        dispatch({ type: "FETCH_ERROR", payload: err });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
