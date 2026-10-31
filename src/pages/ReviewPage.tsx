import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { reviewClaimProof } from "../api/client";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "../schemas/reviewSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function ReviewPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    mode: "onBlur",
    defaultValues: { proof: "" },
  });

  const review = useMutation({ mutationFn: reviewClaimProof });
  const proofText = watch("proof") ?? "";

  const onSubmit = (values: ReviewFormValues): void => {
    review.mutate(values.proof);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
        AI Claim Review
      </h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Explain why you believe a lost item is yours. AI can suggest ways to
        make your explanation clearer, but it cannot verify ownership or decide
        your claim.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="proof" className="text-foreground">
            Explanation of ownership
          </Label>
          <textarea
            id="proof"
            rows={6}
            maxLength={2000}
            {...register("proof")}
            aria-invalid={errors.proof ? true : undefined}
            aria-describedby={errors.proof ? "proof-error" : undefined}
            placeholder="Describe identifying details and where or when you last had the item. Include only details that are true."
            className="rounded-lg border border-input bg-background p-2.5 text-sm text-foreground"
          />
          {errors.proof && (
            <p id="proof-error" role="alert" className="text-sm text-red-600">
              {errors.proof.message}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter 20–2,000 characters. Do not include passwords or student
            numbers. {proofText.length}/2000
          </p>
        </div>

        <Button
          type="submit"
          disabled={review.isPending}
          className="justify-self-start"
        >
          {review.isPending ? "Reviewing..." : "Review my explanation"}
        </Button>
      </form>

      {review.isError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {review.error.message}
        </p>
      )}

      {review.data && (
        <section
          aria-live="polite"
          className="mt-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Feedback on your explanation
          </h3>
          <p className="text-gray-900 dark:text-white">
            {review.data.summary}
          </p>

          {review.data.helpfulDetails.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Helpful details you included
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.helpfulDetails.map((detail, index) => (
                  <li key={index + "-" + detail}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {review.data.suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Details you could add, if true
              </h4>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                {review.data.suggestions.map((suggestion, index) => (
                  <li key={index + "-" + suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ReviewPage;
