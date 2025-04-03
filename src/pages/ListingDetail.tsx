
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ListingWithDetails } from "@/types/listings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Heart, Clock, Calendar, MapPin, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("listings")
          .select(`
            *,
            user:profiles(*),
            category:categories(*),
            kind:kinds(*),
            type:types(*),
            images:listing_images(*)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        
        setListing(data as ListingWithDetails);
        
        // Set main image
        const mainImg = data.images?.find((img: any) => img.is_main);
        setMainImage(mainImg ? mainImg.url : data.images?.[0]?.url || null);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, toast]);

  const handleContactOwner = () => {
    // This would typically open a chat or messaging interface
    toast({
      title: "Contact initiated",
      description: "This feature is not implemented yet",
    });
  };

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save listings to favorites",
      });
      return;
    }

    // This would toggle favorite status
    toast({
      title: "Favorites",
      description: "This feature is not implemented yet",
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
          <p className="mb-4">The listing you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/listings")}>Back to Listings</Button>
        </div>
      </Layout>
    );
  }

  // Get the user's avatar initials
  const userInitials = listing.user?.display_name 
    ? listing.user.display_name.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back button and title */}
        <div className="mb-6">
          <Link 
            to="/listings" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <div className="flex items-center mt-2 space-x-2">
            {listing.kind && (
              <Badge variant="outline">{listing.kind.name}</Badge>
            )}
            {listing.category && (
              <Badge>{listing.category.name}</Badge>
            )}
            <span className="text-muted-foreground text-sm">
              Listed on {formatDate(listing.created_at)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - image and description */}
          <div className="lg:col-span-2">
            {/* Image gallery - for now just showing the main image */}
            <div className="mb-6">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={listing.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
              
              {/* Thumbnail gallery - if there are multiple images */}
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {listing.images.map((image) => (
                    <div 
                      key={image.id}
                      className={`cursor-pointer ${mainImage === image.url ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setMainImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt="" 
                        className="h-20 w-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description || "No description provided."}
              </p>
            </div>

            {/* Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Credits</Badge>
                  <span>{listing.credits}</span>
                </div>
                {listing.location_type && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{listing.location_type}</span>
                  </div>
                )}
                {listing.type && (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{listing.type.name}</span>
                  </div>
                )}
                {listing.created_at && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Posted on {formatDate(listing.created_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              {/* Listing price/credits */}
              <div className="mb-6 text-center">
                <span className="text-3xl font-bold">{listing.credits}</span>
                <span className="text-xl ml-1">credits</span>
              </div>

              <Separator className="my-4" />

              {/* Owner info */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Listed by</h3>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={listing.user?.avatar_url || ""} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {listing.user?.display_name || listing.user?.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Member since {listing.user?.created_at ? 
                        new Date(listing.user.created_at).toLocaleDateString(undefined, {month: 'short', year: 'numeric'}) : 
                        'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button className="w-full" onClick={handleContactOwner}>
                  <User className="mr-2 h-4 w-4" /> Contact
                </Button>
                <Button variant="outline" className="w-full" onClick={handleFavorite}>
                  <Heart className="mr-2 h-4 w-4" /> Add to Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;
