import React from "react";

export default function UserSelector({ users, onSelect, selectedUser, onLoadMore, hasMore }) {
  const selectedUserData = users.find((user) => user.user_id === selectedUser);

  return (
    <section className="max-w-3xl mx-auto mb-10 px-4 select-none">
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">
        Select a User
      </h2>

      <select
        className="w-full p-3 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        onChange={(e) => {
          const value = e.target.value;
          onSelect(value === "" ? null : Number(value));
        }}
        value={selectedUser ?? ""}
        aria-label="Select a user"
      >
        <option value="" disabled>
          -- Select User --
        </option>
        {users.map((user) => (
          <option key={user.user_id} value={user.user_id}>
            User {user.user_id} ({user.age}, {user.gender}, {user.occupation})
          </option>
        ))}
      </select>

      {selectedUserData && (
        <p className="mt-4 text-indigo-600 text-center font-medium">
          Selected: User {selectedUserData.user_id} ({selectedUserData.age},{" "}
          {selectedUserData.gender}, {selectedUserData.occupation})
        </p>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-gradient-to-r from-accentGradientStart to-accentGradientEnd text-white rounded-lg font-semibold shadow-md hover:from-accentGradientEnd hover:to-accentGradientStart transition"
          >
            Load More Users
          </button>
        </div>
      )}
    </section>
  );
}
