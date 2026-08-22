import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type { ApiClaim } from "../types/index";
import ClaimCard from "../components/ClaimCard";
import { fetchClaims, createClaim } from "../api/client";

function ClaimsPage() {
  // Local form state because only this page uses these values.
  const [itemId, setItemId] = useState<string>("");
  const [proof, setProof] = useState<string>("");

  const queryClient = useQueryClient();

  // READ: GET /claims
  const { data, isPending, isError, error } = useQuery<ApiClaim[]>({
  queryKey: ["claims"],
  queryFn: fetchClaims,
});

  // WRITE: POST /claims
  const addClaim = useMutation({
    mutationFn: createClaim,

    onSuccess: () => {
      // The claims list is now outdated, so React Query refetches it.
      queryClient.invalidateQueries({
        queryKey: ["claims"],
      });

      setItemId("");
      setProof("");
    },
  });

  const handleAdd = (): void => {
    addClaim.mutate({
      itemId: Number(itemId),
      claimantId: 1,
      claimDate: new Date().toISOString(),
      status: "approved",
      proof: proof,
    });
  };

  if (isPending) {
    return (
      <div className="animate-pulse p-6">
        Loading claims...
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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h2>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <input
          type="number"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Item ID"
          className="rounded border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <input
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          placeholder="Proof of ownership"
          className="w-full rounded border border-gray-300 bg-white p-2 text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <button
          onClick={handleAdd}
          disabled={
            itemId === "" ||
            proof === "" ||
            addClaim.isPending
          }
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addClaim.isPending ? "Saving..." : "Add Claim"}
        </button>
      </div>

      {addClaim.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addClaim.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((claim) => (
          <ClaimCard key={claim.id} claim={claim}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Proof: {claim.proof}
            </p>
          </ClaimCard>
        ))}
      </div>
    </div>
  );
}

export default ClaimsPage;