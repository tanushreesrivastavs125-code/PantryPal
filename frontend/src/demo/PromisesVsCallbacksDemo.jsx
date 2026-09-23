import React, { useState } from "react";
import {
  runCallbackHellFlow,
  runPromiseChainFlow,
  runAsyncAwaitFlow,
} from "./promisesVsCallbacksDemo";

/**
 * React Component Demonstrating:
 * "JavaScript — Promises vs callbacks" (0.1 pts • Frontend)
 */
export default function PromisesVsCallbacksDemo() {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("comparison");

  const addLog = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
  };

  const handleRunCallback = () => {
    setLogs([]);
    setResult(null);
    setRunning(true);
    addLog("Initiating Callback Hell demonstration...");

    runCallbackHellFlow("user-123", addLog, (err, res) => {
      setRunning(false);
      if (err) {
        addLog(`Callback Error: ${err.message}`);
      } else {
        setResult(res);
        addLog("Callback execution completed.");
      }
    });
  };

  const handleRunPromiseChain = async () => {
    setLogs([]);
    setResult(null);
    setRunning(true);
    addLog("Initiating Promise Chain (.then) demonstration...");

    try {
      const res = await runPromiseChainFlow("user-123", addLog);
      setResult(res);
      addLog("Promise Chain execution completed successfully.");
    } catch (err) {
      addLog(`Promise Chain Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleRunAsyncAwait = async () => {
    setLogs([]);
    setResult(null);
    setRunning(true);
    addLog("Initiating async/await demonstration...");

    try {
      const res = await runAsyncAwaitFlow("user-123", addLog);
      setResult(res);
      addLog("Async/Await execution completed successfully.");
    } catch (err) {
      addLog(`Async/Await Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-4">
        <div>
          <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-2">
            0.1 pts • Frontend Concept
          </div>
          <h2 className="text-xl font-bold text-stone-800">
            JavaScript — Promises vs Callbacks
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Comparing error-first callbacks, callback hell, promisification, promise chains, and async/await.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRunCallback}
            disabled={running}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition"
          >
            Run Callback Hell
          </button>
          <button
            onClick={handleRunPromiseChain}
            disabled={running}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition"
          >
            Run Promise Chaining
          </button>
          <button
            onClick={handleRunAsyncAwait}
            disabled={running}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Run Async / Await
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <div className="font-bold text-rose-700 mb-1">1. Callbacks</div>
          <p className="text-stone-600 mb-2">
            Passes function references. Leads to "Pyramid of Doom" with deeply nested logic and inverted control.
          </p>
          <code className="text-stone-800 font-mono text-[11px] block bg-white p-2 rounded border border-stone-200">
            fetchUser(id, (err, user) =&gt; &#123; ... &#125;)
          </code>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <div className="font-bold text-amber-700 mb-1">2. Promises (.then)</div>
          <p className="text-stone-600 mb-2">
            First-class asynchronous objects. Flattened chains, trust guarantee (resolves only once), unified .catch().
          </p>
          <code className="text-stone-800 font-mono text-[11px] block bg-white p-2 rounded border border-stone-200">
            fetchUser(id).then(user =&gt; ...).catch(err =&gt; ...)
          </code>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
          <div className="font-bold text-blue-700 mb-1">3. Async / Await</div>
          <p className="text-stone-600 mb-2">
            Syntactic sugar over Promises. Sequential appearance, standard try/catch blocks, native stack traces.
          </p>
          <code className="text-stone-800 font-mono text-[11px] block bg-white p-2 rounded border border-stone-200">
            const user = await fetchUser(id);
          </code>
        </div>
      </div>

      {/* Execution Log Terminal */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
          <span>Execution Log Output:</span>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="text-stone-400 hover:text-stone-600 text-xs underline"
            >
              Clear Log
            </button>
          )}
        </div>
        <div className="bg-stone-900 text-stone-200 p-4 rounded-xl font-mono text-xs min-h-[120px] max-h-48 overflow-y-auto space-y-1">
          {logs.length === 0 ? (
            <span className="text-stone-500 italic">
              Click any execution button above to observe asynchronous flow logs in real-time...
            </span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="leading-relaxed">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolved Data Preview */}
      {result && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
          <span className="font-bold">Final Resolved Value: </span>
          <span>User: {result.user?.name} | Pantry: {result.pantry?.name} | Items Count: {result.items?.length}</span>
        </div>
      )}
    </div>
  );
}
