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
      <header className="border-b bg-gradient-to-r from-[#98DDCA]/30 to-[#89BBFE]/30">
        <div className="container py-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#98DDCA] to-[#89BBFE] bg-clip-text text-transparent">
              Food Share
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-[#FFAAA7]/20 text-[#FF8C8C] rounded-full">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === "helper" && (
              <Link href="/create">
                <Button className="bg-[#98DDCA] hover:bg-[#98DDCA]/90 text-white shadow-lg hover:shadow-xl transition-all">
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

      <main className="container py-16">
        <Tabs defaultValue="active" className="space-y-12">
          <TabsList className="w-full max-w-md mx-auto bg-[#89BBFE]/10 p-1">
            <TabsTrigger value="active" className="flex-1">
              {user?.role === "helper" ? "Available Donations" : "Available Food"}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              {user?.role === "helper" ? "My Donations" : "Accepted Food"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#98DDCA] to-[#89BBFE] bg-clip-text text-transparent mb-4">
                {user?.role === "helper" ? "Available Donations" : "Available Food"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {user?.role === "helper"
                  ? "Create a listing to share food with NGOs in your area"
                  : "Browse and accept available food donations nearby"}
              </p>
            </div>
            <ListingGrid />
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-[#98DDCA] to-[#89BBFE] bg-clip-text text-transparent mb-4">
                {user?.role === "helper" ? "My Donations" : "Accepted Food"}
              </h2>
              <p className="text-lg text-muted-foreground">
                {user?.role === "helper"
                  ? "Track your food donation history and impact"
                  : "View food items you've accepted and their details"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {myListings?.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
              {!myListings?.length && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium text-[#FF8C8C]">
                      No {user?.role === "helper" ? "donations" : "accepted food"} found
                    </p>
                    <p className="text-muted-foreground">
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