import { z } from "zod";

export const claimSchema = z.object({
  itemId: z
    .string()
    .min(1, "Enter an item ID.")
    .refine(
      (value) =>
        Number.isInteger(Number(value)) &&
        Number(value) > 0,
      "Item ID must be a positive whole number."
    ),

  proof: z
    .string()
    .trim()
    .min(1, "Proof of ownership is required.")
    .min(5, "Proof of ownership must be at least 5 characters."),
});

export type ClaimFormValues = z.infer<typeof claimSchema>;