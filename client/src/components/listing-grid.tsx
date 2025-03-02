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
        <Loader2 className="h-12 w-12 animate-spin text-[#98DDCA]" />
      </div>
    );
  }

  const filteredListings = listings?.filter(listing => 
    !cityFilter || listing.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#89BBFE]" />
          <Input 
            placeholder="Search by city..." 
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="pl-9 bg-[#98DDCA]/5 border-2 border-[#98DDCA]/20 focus-visible:ring-[#98DDCA] focus-visible:border-[#98DDCA]"
          />
        </div>
      </div>

      {!filteredListings?.length ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center space-y-2">
            <p className="text-xl font-medium text-[#FF8C8C]">
              No active listings available
              {cityFilter && " for this city"}
            </p>
            <p className="text-muted-foreground">
              {cityFilter 
                ? "Try searching for a different city"
                : "Check back later for new donations"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}