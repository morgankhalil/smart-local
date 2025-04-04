import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

export const useListingOptions = () => {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tables<"categories">[];
    },
  });

  const { data: kinds, isLoading: kindsLoading } = useQuery({
    queryKey: ["kinds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("kinds")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tables<"kinds">[];
    },
  });

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tables<"types">[];
    },
  });

  const isLoading = categoriesLoading || kindsLoading || typesLoading;

  return {
    categories: categories || [],
    kinds: kinds || [],
    types: types || [],
    isLoading,
  };
}; 