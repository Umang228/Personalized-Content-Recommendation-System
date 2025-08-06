import React from "react";

export default function MovieList({ recommendations, selectedUser }) {
  return (
    <section>
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-8 select-none">
        {selectedUser
          ? `Recommendations for User ${selectedUser}`
          : "Recommended Movies"}
      </h2>
      {recommendations.length === 0 ? (
        <p className="text-center text-indigo-200 text-lg select-none">
          Select a user to see recommendations.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recommendations.map((movie) => (
            <div
              key={movie.movie_id}
              className="bg-white bg-opacity-80 rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-br from-primaryGradientStart to-primaryGradientEnd flex items-center justify-center text-indigo-50 italic text-sm select-none">
                Poster
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 truncate" title={movie.title}>
                  {movie.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-gradient-to-tr from-accentGradientStart to-accentGradientEnd text-white rounded-full px-3 py-1 text-xs font-semibold select-none"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
  