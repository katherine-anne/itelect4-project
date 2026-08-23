import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { ApiClaim } from "../types/index";
import { claimSchema } from "../schemas/claimSchema";
import type { ClaimFormValues } from "../schemas/claimSchema";
import ClaimCard from "../components/ClaimCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchClaims, createClaim } from "../api/client";

function ClaimsPage() {
  const queryClient = useQueryClient();

  // useForm holds the values, runs the schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    mode: "onBlur",
    defaultValues: {
      itemId: "",
      proof: "",
    },
  });

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

      // Clears every form field at once.
      reset();
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: ClaimFormValues): void => {
    addClaim.mutate({
      itemId: Number(values.itemId),
      claimantId: 1,
      claimDate: new Date().toISOString(),
      status: "approved",
      proof: values.proof,
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="itemId" className="text-foreground">
            Item ID
          </Label>

          <Input
            id="itemId"
            type="number"
            {...register("itemId")}
            aria-invalid={errors.itemId ? true : undefined}
            placeholder="Item ID"
          />

          {errors.itemId && (
            <p className="text-sm text-red-600">
              {errors.itemId.message}
            </p>
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
            placeholder="Proof of ownership"
          />

          {errors.proof && (
            <p className="text-sm text-red-600">
              {errors.proof.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={addClaim.isPending}
          className="justify-self-start"
        >
          {addClaim.isPending ? "Saving..." : "Add Claim"}
        </Button>
      </form>

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