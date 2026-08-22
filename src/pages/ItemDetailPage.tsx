import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";

import type { ApiItem, Item } from "../types/index";
import ItemCard from "../components/ItemCard";
import { fetchItemById } from "../api/client";

function ItemDetailPage() {
  // Reads whatever is in the :id slot of the URL.
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  // The id from the URL is part of the query key.
  const { data, isPending, isError, error } = useQuery<
    ApiItem,
    Error,
    Item
  >({
    queryKey: ["items", id],
    queryFn: () => fetchItemById(id!),
    enabled: id !== undefined,

    // Convert API values into the Item type used by ItemCard.
    select: (item) => ({
      ...item,
      id: Number(item.id),
      dateReported: new Date(item.dateReported),
    }),
  });

  if (id === undefined) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        No item ID was provided.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="animate-pulse p-6">
        Loading item...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {data.itemName}
      </h2>

      <div className="max-w-sm">
        <ItemCard
          item={data}
          onSelect={() => undefined}
        />
      </div>

      <button
        onClick={() => navigate("/items")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Back to Items
      </button>
    </div>
  );
}

export default ItemDetailPage;