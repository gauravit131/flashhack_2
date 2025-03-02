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
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredListings = listings?.filter(listing => 
    !cityFilter || listing.city.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by city..." 
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {!filteredListings?.length ? (
        <div className="text-center text-muted-foreground py-8">
          No active listings available
          {cityFilter && " for this city"}
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