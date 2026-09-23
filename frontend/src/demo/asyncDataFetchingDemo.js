/**
 * ============================================================================
 * DUMMY / DEMONSTRATION FILE: Async Data Fetching from API
 * Topic: Async data fetching from API (0.2 pts • Frontend)
 * Project: PantryPal Smart Kitchen Management System
 * ============================================================================
 * 
 * Demonstrates complete front-end asynchronous data fetching patterns:
 * 1. Native Fetch with async/await & HTTP status verification
 * 2. Axios client with baseURL, timeout, and authentication headers
 * 3. Request cancellation with AbortController (cleanup pattern)
 * 4. Concurrent / Parallel API requests via Promise.all and Promise.allSettled
 * 5. Resilient fetching: Exponential backoff retry mechanism
 */

import api from "../services/api";

/**
 * 1. Native Fetch with async/await and robust error handling
 */
export const fetchPantryItemsNative = async (pantryId, signal) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/v1/pantries/${pantryId}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    signal, // AbortController signal
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `HTTP Error ${response.status}: Failed to fetch items`
    );
  }

  const result = await response.json();
  return result.data;
};

/**
 * 2. Axios-based Async Data Fetching with Timeout and Cancel Token / AbortSignal
 */
export const fetchRecipesAxios = async ({ page = 1, limit = 10, signal }) => {
  const response = await api.get("/recipes", {
    params: { page, limit },
    signal,
  });
  return response.data;
};

/**
 * 3. Concurrent Parallel Fetching using Promise.all
 * Fetches multiple independent endpoints simultaneously for fast dashboard load.
 */
export const fetchDashboardDataParallel = async (signal) => {
  const startTime = performance.now();

  // Execute in parallel rather than sequentially (waterfall)
  const [pantriesRes, recipesRes, alertsRes] = await Promise.all([
    api.get("/pantries", { signal }).catch((err) => ({ data: { data: [] } })),
    api.get("/recipes", { signal }).catch((err) => ({ data: { data: [] } })),
    api.get("/pantries/expiring-soon", { signal }).catch((err) => ({ data: { data: [] } })),
  ]);

  const durationMs = Math.round(performance.now() - startTime);

  return {
    pantries: pantriesRes.data?.data || [],
    recipes: recipesRes.data?.data || [],
    expiringAlerts: alertsRes.data?.data || [],
    durationMs,
  };
};

/**
 * 4. Fault-tolerant Parallel Fetching with Promise.allSettled
 * Ensures one failing API does NOT fail the entire dashboard.
 */
export const fetchSettledDashboardData = async (signal) => {
  const results = await Promise.allSettled([
    api.get("/pantries", { signal }),
    api.get("/shopping-list", { signal }),
    api.get("/meal-plans/active", { signal }),
  ]);

  return {
    pantries: results[0].status === "fulfilled" ? results[0].value.data?.data : [],
    shoppingList: results[1].status === "fulfilled" ? results[1].value.data?.data : [],
    activeMealPlan: results[2].status === "fulfilled" ? results[2].value.data?.data : null,
    errors: results
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason?.message || "Unknown error"),
  };
};

/**
 * 5. Resilient Fetch with Exponential Backoff Retry Strategy
 */
export const fetchWithRetry = async (fn, maxRetries = 3, delayMs = 500) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry if aborted by user
      if (error?.name === "CanceledError" || error?.name === "AbortError") {
        throw error;
      }
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      // Exponential backoff: 500ms, 1000ms, 2000ms...
      const backoff = delayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
};
