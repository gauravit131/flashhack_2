import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { MapPin, Clock, Calendar } from "lucide-react";

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
  const formattedCreatedAt = format(new Date(listing.createdAt), "PPp");
  const formattedAcceptedAt = listing.acceptedAt 
    ? format(new Date(listing.acceptedAt), "PPp") 
    : null;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle>{listing.title}</CardTitle>
            <CardDescription>{listing.description}</CardDescription>
          </div>
          <Badge 
            variant={
              listing.status === "available" 
                ? "default" 
                : listing.status === "accepted" 
                ? "success" 
                : "secondary"
            }
          >
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <div className="space-y-1">
                <p>{listing.locality}, {listing.city}</p>
                <p>{listing.state} - {listing.pincode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {listing.status === "available" ? (
                <span>Expires {timeLeft}</span>
              ) : (
                <span>Expired</span>
              )}
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="font-medium">Quantity: {listing.quantity}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <div>
                {listing.status === "accepted" ? (
                  <>
                    <p>Created: {formattedCreatedAt}</p>
                    <p>Accepted: {formattedAcceptedAt}</p>
                  </>
                ) : (
                  <p>Created: {formattedCreatedAt}</p>
                )}
              </div>
            </div>
          </div>
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