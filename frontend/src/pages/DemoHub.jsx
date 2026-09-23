import React, { useState } from "react";
import SqlJoinsFrontendDemo from "../demo/SqlJoinsFrontendDemo";
import AsyncDataFetchingDemo from "../demo/AsyncDataFetchingDemo";
import LlmIntegrationDemo from "../demo/LlmIntegrationDemo";
import PromisesVsCallbacksDemo from "../demo/PromisesVsCallbacksDemo";

/**
 * DemoHub Page
 * Interactive showcase of the evaluated concepts and viva demonstrations:
 * 1. SQL JOINs (0.2 pts • SQL (Postgres))
 * 2. Async data fetching from API (0.2 pts • Frontend)
 * 3. LLM API integration (0.2 pts • AI App Eng)
 * 4. JavaScript — Promises vs callbacks (0.1 pts • Frontend)
 */
export default function DemoHub() {
  const [activeTab, setActiveTab] = useState("sql-joins");

  const tabs = [
    {
      id: "sql-joins",
      label: "SQL JOINs",
      badge: "0.2 pts • Postgres",
      color: "border-indigo-600 text-indigo-700",
    },
    {
      id: "async-fetch",
      label: "Async Data Fetching",
      badge: "0.2 pts • Frontend",
      color: "border-emerald-600 text-emerald-700",
    },
    {
      id: "llm-api",
      label: "LLM API Integration",
      badge: "0.2 pts • AI App Eng",
      color: "border-purple-600 text-purple-700",
    },
    {
      id: "promises-callbacks",
      label: "Promises vs Callbacks",
      badge: "0.1 pts • Frontend",
      color: "border-blue-600 text-blue-700",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 mb-2">
              Viva & Evaluation Concepts Hub
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              PantryPal Project Concept Implementations
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Live working demonstrations and source code implementations for project scoring concepts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Total Points: +0.7 pts Complete
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-stone-700 text-stone-200" : "bg-white text-stone-500"
              }`}>
                {tab.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === "sql-joins" && <SqlJoinsFrontendDemo />}
        {activeTab === "async-fetch" && <AsyncDataFetchingDemo />}
        {activeTab === "llm-api" && <LlmIntegrationDemo />}
        {activeTab === "promises-callbacks" && <PromisesVsCallbacksDemo />}
      </div>
    </div>
  );
}
