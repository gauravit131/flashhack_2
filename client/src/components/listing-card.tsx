import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { MapPin, Clock, Calendar, Phone, User } from "lucide-react";

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
    <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">{listing.title}</CardTitle>
            <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
          </div>
          <Badge 
            variant={
              listing.status === "available" 
                ? "default" 
                : listing.status === "accepted" 
                ? "success" 
                : "secondary"
            }
            className="capitalize px-3 py-1"
          >
            {listing.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3 bg-muted/30 rounded-lg p-3">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-1 text-primary" />
              <div className="space-y-1">
                <p>{listing.locality}, {listing.city}</p>
                <p>{listing.state} - {listing.pincode}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className={listing.status === "available" ? "text-primary font-medium" : "text-muted-foreground"}>
                {listing.status === "available" ? `Expires ${timeLeft}` : "Expired"}
              </span>
            </div>
            {(user?.role === "ngo" || listing.acceptedBy === user?.id) && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="font-medium">{listing.mobileNumber}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t space-y-3">
            <p className="font-medium text-lg">Quantity: {listing.quantity}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 text-primary" />
              <div>
                <p>Posted by: <span className="font-medium">{listing.creatorName}</span></p>
                {listing.status === "accepted" && (
                  <p>Accepted by: <span className="font-medium">{listing.acceptorName}</span></p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
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
      {user?.role === "ngo" && listing.status === "available" && (
        <CardFooter>
          <Button
            className="w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            onClick={() => acceptMutation.mutate()}
            disabled={acceptMutation.isPending}
          >
            Accept Donation
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}