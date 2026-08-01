import { useState, useEffect, useRef } from "react";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

import UserCard from "./components/UserCard";
import ItemCard from "./components/ItemCard";
import ClaimCard from "./components/ClaimCard";

import type { User, Item, Claim } from "./types";

const student: User = {
  id: 1,
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  role: "student",
  isActive: true,
};

const lostItems: Item[] = [
  {
    id: 1,
    itemName: "Black Wallet",
    description: "Contains school ID and cards",
    location: "Library",
    dateReported: new Date(),
    status: "lost",
    ownerId: 1,
  },
  {
    id: 2,
    itemName: "Pink Umbrella",
    description: "Automatic umbrella with a pink floral design",
    location: "Women's Restroom",
    dateReported: new Date(),
    status: "lost",
    ownerId: 2,
  },
  {
    id: 3,
    itemName: "Silver Water Bottle",
    description: "Stainless steel bottle with a blue cap",
    location: "Gymnasium",
    dateReported: new Date(),
    status: "found",
    ownerId: 3,
  },
  {
    id: 4,
    itemName: "Scientific Calculator",
    description: "Black Casio calculator with a name sticker at the back",
    location: "Engineering Building",
    dateReported: new Date(),
    status: "claimed",
    ownerId: 4,
  },
];

const claim: Claim = {
  id: 1,
  itemId: 1,
  claimantId: 2,
  claimDate: new Date(),
  status: "approved",
  proof: "Student ID presented",
};

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showClaims, toggleShowClaims] = useToggle(true);
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  const previousSearchTerm = usePrevious(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setSelectedUser(student);
        setItems(lostItems);
        setSelectedClaim(claim);
        setIsError(false);
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };

  const handleSelectUser = (user: User): void => {
    setSelectedUser(user);
  };

  const handleViewItem = (item: Item): void => {
    alert(`Viewing Item: ${item.itemName}`);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse rounded-lg bg-white px-6 py-4 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-300">
          Loading lost and found data...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          Could not load lost and found data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Campus Lost & Found Tracker
          </h1>

          <button
            onClick={toggleDarkMode}
            className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search lost and found items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={focusSearch}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Focus Search
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Current Search: {searchTerm || "None"}</p>
          <p>Previous Search: {previousSearchTerm || "None"}</p>
        </div>

        {selectedUser && (
          <div className="mt-6">
            <UserCard user={selectedUser} onSelect={handleSelectUser} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onSelect={handleViewItem} />
          ))}
        </div>

        <div className="mt-8">
          <button
            onClick={toggleShowClaims}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            {showClaims ? "Hide Claim" : "Show Claim"}
          </button>

          {showClaims && selectedClaim && (
            <div className="mt-4">
              <ClaimCard claim={selectedClaim} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;