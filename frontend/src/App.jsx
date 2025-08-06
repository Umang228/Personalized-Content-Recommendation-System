import React, { useState, useEffect } from "react";
import UserSelector from "./components/UserSelector";
import MovieList from "./components/MovieList";
import ClusterDisplay from "./components/ClusterDisplay";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState(null);
  const usersPerPage = 20;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      });

    fetch("http://127.0.0.1:5000/api/clusters")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clusters");
        return res.json();
      })
      .then(setClusters)
      .catch((err) => {
        console.error("Error fetching clusters:", err);
        setError("Failed to load clusters. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setRecommendations([]);
      return;
    }
    fetch(`http://127.0.0.1:5000/api/recommend/${selectedUser}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        return res.json();
      })
      .then(setRecommendations)
      .catch((err) => {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations. Please try again later.");
      });
  }, [selectedUser]);

  const paginatedUsers = users.slice(0, page * usersPerPage);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-r from-primaryGradientStart to-primaryGradientEnd text-gray-900">
      <header className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-md shadow-md z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow-sm select-none">
            MovieLens Explorer
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setTab(0)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                tab === 0
                  ? "bg-gradient-to-r from-accentGradientStart to-accentGradientEnd text-white shadow-lg"
                  : "text-indigo-500 hover:text-indigo-700"
              }`}
              aria-current={tab === 0 ? "page" : undefined}
              type="button"
            >
              Recommendations
            </button>
            <button
              onClick={() => setTab(1)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                tab === 1
                  ? "bg-gradient-to-r from-accentGradientStart to-accentGradientEnd text-white shadow-lg"
                  : "text-indigo-500 hover:text-indigo-700"
              }`}
              aria-current={tab === 1 ? "page" : undefined}
              type="button"
            >
              User Clusters
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 rounded-md p-4">
            {error}
          </div>
        )}

        {tab === 0 && (
          <section className="space-y-12">
            <UserSelector
              users={paginatedUsers}
              onSelect={setSelectedUser}
              selectedUser={selectedUser}
              onLoadMore={() => setPage(page + 1)}
              hasMore={page * usersPerPage < users.length}
            />
            <MovieList recommendations={recommendations} selectedUser={selectedUser} />
          </section>
        )}

        {tab === 1 && (
          <section>
            <ClusterDisplay clusters={clusters} />
          </section>
        )}
      </main>
      <footer className="text-center py-6 bg-white bg-opacity-90 text-indigo-600 font-medium select-none">
        &copy; {new Date().getFullYear()} MovieLens Explorer
      </footer>
    </div>
  );
}

export default App;
