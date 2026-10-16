import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiClaim, ApiItem } from "../types/index";
import { claimSchema, type ClaimFormValues } from "../schemas/claimSchema";
import ClaimCard from "../components/ClaimCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClaim, fetchClaims, fetchItems } from "../api/client";

function ClaimsPage() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    mode: "onBlur",
    defaultValues: { itemId: "", proof: "" },
  });

  const items = useQuery<ApiItem[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  const claims = useQuery<ApiClaim[]>({
    queryKey: ["claims"],
    queryFn: fetchClaims,
  });

  const addClaim = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      reset();
    },
  });

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

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Claims
      </h2>

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
          <Input
            id="proof"
            {...register("proof")}
            aria-invalid={errors.proof ? true : undefined}
            placeholder="Describe proof of ownership"
          />
          {errors.proof && (
            <p className="text-sm text-red-600">{errors.proof.message}</p>
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

      {addClaim.isError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {addClaim.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {claims.data.map((claim) => (
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
