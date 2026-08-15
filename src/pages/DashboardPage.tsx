// src/pages/DashboardPage.tsx

import { useState } from "react";
import type { User } from "../types/index";
import UserCard from "../components/UserCard";
import useToggle from "../hooks/useToggle";
import { student } from "../data/mockData";

function DashboardPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UserCard
          user={student}
          onSelect={setSelectedUser}
        />
      </div>

      <button
        onClick={toggleDetails}
        className="mt-4 rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
      >
        {showDetails ? "Hide" : "Show"} Details
      </button>

      {showDetails && selectedUser !== null && (
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Selected: {selectedUser.name} ({selectedUser.role})
        </p>
      )}
    </div>
  );
}

export default DashboardPage;