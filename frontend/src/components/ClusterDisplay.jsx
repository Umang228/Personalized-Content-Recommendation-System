import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function safeFixed(val, places = 2, fallback = "N/A") {
  return typeof val === "number" && isFinite(val) ? val.toFixed(places) : fallback;
}
function safePercent(val, places = 2, fallback = "N/A") {
  return typeof val === "number" && isFinite(val)
    ? (val * 100).toFixed(places)
    : fallback;
}

export default function ClusterDisplay({ clusters }) {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-10 select-none">
        User Clusters
      </h2>
      {!clusters || clusters.length === 0 ? (
        <p className="text-center text-indigo-200 text-lg">Loading cluster data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {clusters.map((cluster, idx) => (
            <div
              key={cluster.cluster ?? idx}
              className="bg-white bg-opacity-80 rounded-xl shadow-lg p-6 flex flex-col"
            >
              <h3 className="text-xl font-semibold mb-2 text-indigo-900 select-none">
                Cluster {cluster.cluster ?? "N/A"}
              </h3>
              <p className="text-indigo-700 mb-1">Users: {cluster.num_users ?? "N/A"}</p>
              <p className="text-indigo-700 mb-1">
                Avg. Age: {safeFixed(cluster.age_mean)} (Std: {safeFixed(cluster.age_std)})
              </p>
              <p className="text-indigo-700 mb-1">
                Gender: M ({safePercent(cluster.gender_dist?.M)}%) | F (
                {safePercent(cluster.gender_dist?.F)}%)
              </p>
              <p className="text-indigo-700 mb-4">
                Top Occupations:{" "}
                {cluster.top_occupations && Object.keys(cluster.top_occupations).length > 0
                  ? Object.entries(cluster.top_occupations)
                      .map(([occ, prob]) => `${occ} (${safePercent(prob, 1)}%)`)
                      .join(", ")
                  : "N/A"}
              </p>

              <h4 className="font-semibold text-indigo-800 mb-2 select-none">
                Genre Preferences:
              </h4>

              {Array.isArray(cluster.genre_preferences) &&
              cluster.genre_preferences.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cluster.genre_preferences}
                      margin={{ top: 10, right: 10, left: 0, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#334155", fontSize: 12 }}
                        angle={45}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis
                        tick={{ fill: "#334155", fontSize: 12 }}
                        domain={[0, 5]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f1f5f9",
                          borderRadius: "8px",
                          color: "#1e293b",
                          border: "none",
                        }}
                      />
                      <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-indigo-400 select-none">No genre data available.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
