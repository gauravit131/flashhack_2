import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listing-grid";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@shared/schema";
import { ListingCard } from "@/components/listing-card";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const { data: myListings } = useQuery<Listing[]>({
    queryKey: [user?.role === "helper" ? "/api/listings/my-donations" : "/api/listings/accepted"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Food Share
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === "helper" && (
              <Link href="/create">
                <Button className="shadow-lg hover:shadow-xl transition-all">
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

      <main className="container py-12">
        <Tabs defaultValue="active" className="space-y-8">
          <TabsList className="w-full max-w-md mx-auto bg-muted/50 p-1">
            <TabsTrigger value="active" className="flex-1">
              {user?.role === "helper" ? "Available Donations" : "Available Food"}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              {user?.role === "helper" ? "My Donations" : "Accepted Food"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                {user?.role === "helper" ? "Available Donations" : "Available Food"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {user?.role === "helper"
                  ? "Create a listing to share food with NGOs in your area"
                  : "Browse and accept available food donations nearby"}
              </p>
            </div>
            <ListingGrid />
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
                {user?.role === "helper" ? "My Donations" : "Accepted Food"}
              </h2>
              <p className="text-muted-foreground text-lg">
                {user?.role === "helper"
                  ? "Track your food donation history and impact"
                  : "View food items you've accepted and their details"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {!myListings?.length && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
                  <div className="text-muted-foreground text-center">
                    <p className="text-lg font-medium mb-2">No {user?.role === "helper" ? "donations" : "accepted food"} found</p>
                    <p className="text-sm">
                      {user?.role === "helper"
                        ? "Start by creating your first food donation"
                        : "Browse available donations to get started"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}