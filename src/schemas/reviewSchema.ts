import { z } from "zod";

export const reviewFormSchema = z.object({
  proof: z
    .string()
    .trim()
    .min(20, "Explain your ownership proof in at least 20 characters.")
    .max(2000, "Keep your proof explanation under 2000 characters."),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
