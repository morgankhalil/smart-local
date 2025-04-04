import { z } from "zod";

export const listingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  credits: z
    .number()
    .min(0, "Credits must be at least 0")
    .max(1000, "Credits must be less than 1000"),
  location_type: z.enum(["remote", "in_person", "hybrid"]),
  category_id: z.string().uuid("Please select a category"),
  kind_id: z.string().uuid("Please select a kind"),
  type_id: z.string().uuid("Please select a type"),
  is_active: z.boolean().default(true),
});

export type ListingFormValues = z.infer<typeof listingSchema>; 