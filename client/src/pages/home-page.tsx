import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ListingGrid } from "@/components/listing-grid";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Available Donations</h2>
            <p className="text-muted-foreground">
              {user?.role === "helper"
                ? "Create a listing to share food with NGOs"
                : "Browse and accept available food donations"}
            </p>
          </div>
        </div>

        <ListingGrid />
      </main>
    </div>
  );
}
