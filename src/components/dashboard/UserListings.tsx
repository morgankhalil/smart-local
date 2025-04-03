
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ListingWithDetails } from "@/types/listings";
import ListingCard from "@/components/listings/ListingCard";
import { useToast } from "@/hooks/use-toast";

interface UserListingsProps {
  limit?: number;
  showViewAll?: boolean;
}

const UserListings = ({ limit, showViewAll = false }: UserListingsProps) => {
  const [listings, setListings] = useState<ListingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    if (!user) return;
    
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
        .eq("user_id", user.id);
      
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      if (data) setListings(data as ListingWithDetails[]);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      toast({
        title: "Error",
        description: "Failed to load your listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {showViewAll ? "Recent Listings" : "All Your Listings"}
        </h2>
        {showViewAll && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard?tab=my-listings">View All</Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't created any listings yet. Start sharing your services or items!
                </p>
                <Button asChild>
                  <Link to="/create-listing">Create Your First Listing</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default UserListings;
