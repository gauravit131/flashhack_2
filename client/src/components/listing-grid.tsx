import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { ListingCard } from "./listing-card";
import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

export function ListingGrid() {
  const [cityFilter, setCityFilter] = useState("");

  const { data: listings, isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const filteredListings = listings?.filter(listing => 
    !cityFilter || listing.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by city..." 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="pl-9 bg-muted/30 border-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {!filteredListings?.length ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              No active listings available
              {cityFilter && " for this city"}
            </p>
            <p className="text-sm text-muted-foreground">
              {cityFilter 
                ? "Try searching for a different city"
                : "Check back later for new donations"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}