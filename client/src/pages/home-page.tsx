import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listing-grid";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { ListingCard } from "@/components/listing-card"; // Added import for ListingCard


export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const { data: myListings } = useQuery<Listing[]>({
    queryKey: [user?.role === "helper" ? "/api/listings/my-donations" : "/api/listings/accepted"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Food Share</h1>
          <div className="flex items-center gap-4">
            {user?.role === "helper" && (
              <Link href="/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => logoutMutation.mutate()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="active">
          <TabsList className="mb-8">
            <TabsTrigger value="active">
              {user?.role === "helper" ? "Available Donations" : "Available Food"}
            </TabsTrigger>
            <TabsTrigger value="history">
              {user?.role === "helper" ? "My Donations" : "Accepted Food"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {user?.role === "helper" ? "Available Donations" : "Available Food"}
              </h2>
              <p className="text-muted-foreground">
                {user?.role === "helper"
                  ? "Create a listing to share food with NGOs"
                  : "Browse and accept available food donations"}
              </p>
            </div>
            <ListingGrid />
          </TabsContent>

          <TabsContent value="history">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {user?.role === "helper" ? "My Donations" : "Accepted Food"}
              </h2>
              <p className="text-muted-foreground">
                {user?.role === "helper"
                  ? "Track your food donation history"
                  : "View food items you've accepted"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {!myListings?.length && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  No {user?.role === "helper" ? "donations" : "accepted food"} found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}