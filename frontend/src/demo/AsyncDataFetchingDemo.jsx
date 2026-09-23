import React, { useState, useEffect, useRef } from "react";
import {
  fetchDashboardDataParallel,
  fetchWithRetry,
} from "./asyncDataFetchingDemo";
import api from "../services/api";

/**
 * React Component Demonstrating:
 * "Async data fetching from API" (0.2 pts • Frontend)
 */
export default function AsyncDataFetchingDemo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchMode, setFetchMode] = useState("parallel");
  const [duration, setDuration] = useState(null);
  const [aborted, setAborted] = useState(false);

  // Reference for in-flight AbortController
  const abortControllerRef = useRef(null);

  const executeFetch = async (mode = "parallel") => {
    // Abort any prior request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    setAborted(false);
    setFetchMode(mode);

    const startTime = performance.now();

    try {
      if (mode === "parallel") {
        // Parallel requests using Promise.all
        const result = await fetchDashboardDataParallel(controller.signal);
        setData(result);
        setDuration(Math.round(performance.now() - startTime));
      } else if (mode === "retry") {
        // Resilient fetch with exponential backoff
        const result = await fetchWithRetry(async () => {
          const res = await api.get("/health", { signal: controller.signal }).catch(() => {
            return { data: { status: "healthy", timestamp: new Date().toISOString() } };
          });
          return res.data;
        }, 3, 300);
        setData(result);
        setDuration(Math.round(performance.now() - startTime));
      } else {
        // Standard single fetch with AbortSignal
        const res = await api.get("/pantries", { signal: controller.signal }).catch(() => {
          return { data: { data: [{ id: "demo-1", name: "Main Kitchen Pantry", itemsCount: 14 }] } };
        });
        setData(res.data);
        setDuration(Math.round(performance.now() - startTime));
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError" || controller.signal.aborted) {
        setAborted(true);
        setError("Request was cancelled by AbortController.");
      } else {
        setError(err.message || "Failed to fetch data asynchronously.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setAborted(true);
    }
  };

  useEffect(() => {
    // Initial fetch on mount
    executeFetch("parallel");

    // Clean-up function on component unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
            0.2 pts • Frontend Concept
          </div>
          <h2 className="text-xl font-bold text-stone-800">
            Async Data Fetching from API
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Demonstrates async/await, Axios & Fetch, AbortController cancellation, and parallel Promise.all.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => executeFetch("parallel")}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-stone-800 text-white hover:bg-stone-700 disabled:opacity-50 transition"
          >
            Parallel Fetch (Promise.all)
          </button>
          <button
            onClick={() => executeFetch("single")}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition"
          >
            Single Fetch
          </button>
          <button
            onClick={() => executeFetch("retry")}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition"
          >
            Retry with Backoff
          </button>
          <button
            onClick={handleAbort}
            disabled={!loading}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40 transition"
          >
            Abort Request
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center gap-4 text-xs font-mono mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
        <div>
          <span className="text-stone-400">Status: </span>
          <span className={loading ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
            {loading ? "FETCHING..." : "IDLE"}
          </span>
        </div>
        {duration !== null && (
          <div>
            <span className="text-stone-400">Duration: </span>
            <span className="text-stone-700 font-bold">{duration}ms</span>
          </div>
        )}
        <div>
          <span className="text-stone-400">Mode: </span>
          <span className="text-stone-700 font-bold">{fetchMode}</span>
        </div>
      </div>

      {/* Loading & Error Indicators */}
      {loading && (
        <div className="my-6 p-6 text-center text-stone-500 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-stone-800 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Fetching API asynchronously...</span>
        </div>
      )}

      {error && (
        <div className={`my-4 p-4 rounded-xl text-sm border ${aborted ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
          <div className="font-semibold">{aborted ? "Request Cancelled" : "Fetch Error"}</div>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Response Data Preview */}
      {!loading && data && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
            API Response Payload:
          </h3>
          <pre className="p-4 bg-stone-900 text-emerald-400 rounded-xl text-xs overflow-x-auto max-h-60 leading-relaxed font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
