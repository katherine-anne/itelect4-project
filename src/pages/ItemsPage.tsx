// src/pages/ItemsPage.tsx -- NEW FILE

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

import type { Item } from "../types/index";
import ItemCard from "../components/ItemCard";
import usePrevious from "../hooks/usePrevious";
import { lostItems } from "../data/mockData";

function ItemsPage() {
  // These came from the item/search section of the old App.tsx
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(lostItems);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(e.target.value);
  };

  // Search by item name or location
  const filteredItems = items.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-6">
        Loading lost and found items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load lost and found items.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Items
      </h2>

      <button
        onClick={() => setIsError(true)}
        className="mb-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700"
      >
        Simulate Error
      </button>

      <input
        ref={searchInputRef}
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search lost and found items..."
        className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 placeholder:text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400"
      />

      {previousSearch !== undefined &&
        previousSearch !== searchTerm && (
          <p className="mt-1 text-sm text-gray-500">
            Previous search: "{previousSearch}"
          </p>
        )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Link
            key={item.id}
            to={`/items/${item.id}`}
            className="block"
          >
            <ItemCard
              item={item}
              onSelect={() => undefined}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ItemsPage;