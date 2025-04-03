
import { Tables } from "@/integrations/supabase/types";

export type ListingWithDetails = Tables<"listings"> & {
  user?: Tables<"profiles"> | null;
  category?: Tables<"categories"> | null;
  kind?: Tables<"kinds"> | null;
  type?: Tables<"types"> | null;
  images?: Tables<"listing_images">[] | null;
};
