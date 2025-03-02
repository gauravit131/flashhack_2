import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { MapPin, Clock } from "lucide-react";

export function ListingCard({ listing }: { listing: Listing }) {
  const { user } = useAuth();

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/listings/${listing.id}/accept`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
    },
  });

  const timeLeft = formatDistanceToNow(new Date(listing.expiresAt), { addSuffix: true });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{listing.title}</CardTitle>
            <CardDescription>{listing.description}</CardDescription>
          </div>
          <Badge variant={listing.status === "available" ? "default" : "secondary"}>
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {listing.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Expires {timeLeft}
          </div>
          <p className="font-medium">Quantity: {listing.quantity}</p>
        </div>
      </CardContent>
      <CardFooter>
        {user?.role === "ngo" && listing.status === "available" && (
          <Button
            className="w-full"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            Accept Donation
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
