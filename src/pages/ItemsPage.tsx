import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import type { ApiItem, Item } from "../types/index";
import ItemCard from "../components/ItemCard";
import usePrevious from "../hooks/usePrevious";
import { fetchItems } from "../api/client";

function ItemsPage() {
  // React Query replaces the old items, loading, error, and useEffect logic.
  const { data, isPending, isError, error } = useQuery<
    ApiItem[],
    Error,
    Item[]
  >({
    queryKey: ["items"],
    queryFn: fetchItems,

    // Convert the JSON API values back into the Item type used by the app.
    select: (items) =>
      items.map((item) => ({
        ...item,
        id: Number(item.id),
        dateReported: new Date(item.dateReported),
      })),
  });

  const [searchTerm, setSearchTerm] = useState<string>("");
  const previousSearch = usePrevious(searchTerm);

  if (isPending) {
    return (
      <div className="animate-pulse p-6">
        Loading lost and found items...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  // Search by item name or location.
  const filteredItems = data.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Items
      </h2>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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