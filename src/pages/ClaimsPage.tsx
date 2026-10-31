import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiClaim, ApiItem, ClaimDecision } from "../types/index";
import { claimSchema, type ClaimFormValues } from "../schemas/claimSchema";
import ClaimCard from "../components/ClaimCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  createClaim,
  fetchClaims,
  fetchItems,
  reviewClaimProof,
  updateClaimStatus,
} from "../api/client";
import useAuthStore from "../store/authStore";

function ClaimsPage() {
  const userRole = useAuthStore((state) => state.userRole);
  const isAdmin = userRole === "securityAdmin";
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    mode: "onBlur",
    defaultValues: { itemId: "", proof: "" },
  });
  const [reviewedProof, setReviewedProof] = useState<string | null>(null);
  const proofText = watch("proof") ?? "";
  const proofForReview = proofText.trim();
  const canReviewProof =
    proofForReview.length >= 20 && proofForReview.length <= 2000;

  const items = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const claims = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  const proofReview = useMutation({ mutationFn: reviewClaimProof });

  const addClaim = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
      proofReview.reset();
      setReviewedProof(null);
    },
  });

  const decideClaim = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ClaimDecision }) =>
      updateClaimStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["claims"] }),
  });

  const requestProofReview = (): void => {
    if (!canReviewProof) return;
    proofReview.reset();
    setReviewedProof(proofForReview);
    proofReview.mutate(proofForReview);
  };

  if (items.isPending || claims.isPending) {
    return <div className="animate-pulse p-6">Loading claims and items...</div>;
  }

  if (items.isError) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        {items.error.message}
      </div>
    );
  }

  if (claims.isError) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        {claims.error.message}
      </div>
    );
  }

  const itemById = new Map(items.data.map((item) => [item.id, item]));
  const claimCards = claims.data.map((claim) => {
    const item = itemById.get(claim.itemId);

    return (
      <ClaimCard key={claim.id} claim={claim}>
        <div className="grid gap-3">
          {isAdmin && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Item: {item?.itemName ?? claim.itemId}
              {item?.location ? ` — ${item.location}` : ""}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Proof: {claim.proof}
          </p>
          {isAdmin && claim.status === "pending" && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={decideClaim.isPending}
                onClick={() =>
                  decideClaim.mutate({ id: claim.id, status: "approved" })
                }
              >
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={decideClaim.isPending}
                onClick={() =>
                  decideClaim.mutate({ id: claim.id, status: "rejected" })
                }
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </ClaimCard>
    );
  });

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        {isAdmin ? "Claim Review" : "My Claims"}
      </h2>

      {isAdmin ? (
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
          Review pending claims and approve or reject each request.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit((values) => addClaim.mutate(values))}
          className="mb-6 grid gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="itemId" className="text-foreground">
              Item
            </Label>
            <select
              id="itemId"
              {...register("itemId")}
              aria-invalid={errors.itemId ? true : undefined}
              className="h-9 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select an item</option>
              {items.data.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName} — {item.location}
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p className="text-sm text-red-600">{errors.itemId.message}</p>
            )}
            {items.data.length === 0 && (
              <p className="text-sm text-gray-500">No items are available yet.</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="proof" className="text-foreground">
              Proof of ownership
            </Label>
            <textarea
              id="proof"
              rows={4}
              {...register("proof")}
              aria-invalid={errors.proof ? true : undefined}
              placeholder="Explain what makes you believe this item is yours. Include only details that are true."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            {errors.proof && (
              <p className="text-sm text-red-600">{errors.proof.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI feedback needs 20–2,000 characters. It can suggest clearer
              details, but it cannot verify ownership or decide your claim.
              {" "}{proofForReview.length}/2000
            </p>
            <Button
              type="button"
              disabled={!canReviewProof || proofReview.isPending}
              onClick={requestProofReview}
              className="justify-self-start"
            >
              {proofReview.isPending ? "Reviewing..." : "Review my explanation with AI"}
            </Button>
            {proofReview.isError && reviewedProof === proofForReview && (
              <p role="alert" className="text-sm text-red-700">
                {proofReview.error.message}
              </p>
            )}
            {proofReview.data && reviewedProof === proofForReview && (
              <section
                aria-live="polite"
                className="grid gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-gray-800 dark:border-blue-900 dark:bg-blue-950 dark:text-gray-100"
              >
                <h3 className="font-semibold">AI feedback on your explanation</h3>
                <p>{proofReview.data.summary}</p>
                {proofReview.data.helpfulDetails.length > 0 && (
                  <div>
                    <h4 className="font-medium">Helpful details you included</h4>
                    <ul className="list-disc pl-5">
                      {proofReview.data.helpfulDetails.map((detail, index) => (
                        <li key={index + "-" + detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {proofReview.data.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium">
                      Details you could add, if true
                    </h4>
                    <ul className="list-disc pl-5">
                      {proofReview.data.suggestions.map((suggestion, index) => (
                        <li key={index + "-" + suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          <Button
            type="submit"
            disabled={addClaim.isPending || items.data.length === 0}
            className="justify-self-start"
          >
            {addClaim.isPending ? "Saving..." : "Add Claim"}
          </Button>
        </form>
      )}

      {addClaim.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {addClaim.error.message}
        </p>
      )}

      {decideClaim.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {decideClaim.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {claimCards}
      </div>
      {isAdmin && claims.data.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          There are no claims to review.
        </p>
      )}
    </div>
  );
}

export default ClaimsPage;
