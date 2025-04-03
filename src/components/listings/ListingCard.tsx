
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import type { ListingWithDetails } from '@/types/listings';

interface ListingCardProps {
  listing: ListingWithDetails;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const mainImage = listing.images?.find(img => img.is_main) || listing.images?.[0];
  
  // Get the user's avatar or display initials
  const userInitials = listing.user?.display_name 
    ? listing.user.display_name.substring(0, 2).toUpperCase()
    : "UN"; // Default if no display name
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-gray-100">
        {mainImage ? (
          <img 
            src={mainImage.url} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
        >
          <Heart className="h-5 w-5" />
        </Button>
        {listing.category && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-white">
              {listing.category.name}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Link to={`/listing/${listing.id}`}>
              <h3 className="font-semibold text-lg hover:underline line-clamp-2">{listing.title}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {listing.location_type || "Location type not specified"}
            </p>
          </div>
          <Badge variant="outline" className="ml-2">
            {listing.credits} credits
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {listing.description || "No description provided"}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={listing.user?.avatar_url || ""} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {listing.user?.display_name || listing.user?.username || "Anonymous"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(listing.created_at || "").toLocaleDateString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
