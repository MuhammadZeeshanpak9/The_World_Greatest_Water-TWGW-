"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdminTable<T>(endpoint: string, dataKey: string, queryString: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}${queryString ? `?${queryString}` : ""}`);
      if (!res.ok) throw new Error("Failed to load data");
      const json = await res.json();
      const data: T[] = json[dataKey] ?? [];
      setRows(data);
      setTotal(json.total ?? data.length);
    } catch {
      setError("Something went wrong loading this data.");
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataKey, queryString]);

  useEffect(() => {
    // Standard fetch-on-mount/param-change pattern — fetchData's setLoading(true) runs
    // synchronously before the network call, which the newer set-state-in-effect rule flags.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return { rows, total, loading, error, refetch: fetchData };
}
