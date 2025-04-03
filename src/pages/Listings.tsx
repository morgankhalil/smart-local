
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import ListingCard from "../components/listings/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import FiltersDialog from "@/components/listings/FiltersDialog";
import type { ListingWithDetails } from "@/types/listings";

const Listings = () => {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Tables<"categories">[]>([]);
  
  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, [currentCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      if (data) setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchListings = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          user:profiles(*),
          category:categories(*),
          kind:kinds(*),
          type:types(*),
          images:listing_images(*)
        `)
        .eq("is_active", true);
      
      if (currentCategory) {
        query = query.eq("category_id", currentCategory);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setListings(data as ListingWithDetails[]);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setCurrentCategory(categoryId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Local Listings</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={currentCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => handleCategoryChange(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={currentCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No listings found</h3>
                <p className="text-muted-foreground">
                  Try changing your filters or check back later
                </p>
              </div>
            )}
          </div>
        )}

        <FiltersDialog 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Listings;
