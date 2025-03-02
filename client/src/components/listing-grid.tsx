import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { ListingCard } from "./listing-card";
import { Loader2 } from "lucide-react";

export function ListingGrid() {
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

  if (!listings?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No active listings available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
