import { User, InsertUser, Listing, InsertListing } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

type SortKey = "time" | "quantity";
type SortOrder = "asc" | "desc";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserCount(): Promise<number>;
  createListing(listing: InsertListing & { createdBy: number }): Promise<Listing>;
  getListing(id: number): Promise<Listing | undefined>;
  getActiveListings(sort?: { key: SortKey; order: SortOrder }): Promise<Listing[]>;
  acceptListing(id: number, acceptedBy: number): Promise<Listing | undefined>;
  updateListingStatus(id: number, status: "expired"): Promise<void>;
  getListingsByUser(userId: number): Promise<Listing[]>;
  getAcceptedListings(ngoId: number): Promise<Listing[]>;
  cleanExpiredListings(): Promise<void>;
  getUserById(id: number): Promise<User | undefined>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private listings: Map<number, Listing>;
  private currentUserId: number;
  private currentListingId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.currentUserId = 1;
    this.currentListingId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Run cleanup every minute
    setInterval(() => this.cleanExpiredListings(), 60000);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserCount(): Promise<number> {
    return this.users.size;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createListing(listing: InsertListing & { createdBy: number }): Promise<Listing> {
    const id = this.currentListingId++;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const creator = await this.getUserById(listing.createdBy);

    const newListing: Listing = {
      ...listing,
      id,
      status: "available",
      createdAt: new Date(),
      expiresAt,
      acceptedBy: null,
      acceptedAt: null,
      creatorName: creator?.name || "Unknown",
      acceptorName: null,
    };
    this.listings.set(id, newListing);
    return newListing;
  }

  async getListing(id: number): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getActiveListings(sort?: { key: SortKey; order: SortOrder }): Promise<Listing[]> {
    const now = new Date();
    const activeListings = Array.from(this.listings.values())
      .filter(listing => listing.status === "available" && listing.expiresAt > now);

    if (!sort) return activeListings;

    return activeListings.sort((a, b) => {
      if (sort.key === "time") {
        return sort.order === "asc" 
          ? a.createdAt.getTime() - b.createdAt.getTime()
          : b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        // Assuming quantity is stored as "X kg" or "X meals"
        const qtyA = parseInt(a.quantity.split(" ")[0]) || 0;
        const qtyB = parseInt(b.quantity.split(" ")[0]) || 0;
        return sort.order === "asc" ? qtyA - qtyB : qtyB - qtyA;
      }
    });
  }

  async acceptListing(id: number, acceptedBy: number): Promise<Listing | undefined> {
    const listing = this.listings.get(id);
    if (!listing || listing.status !== "available") return undefined;

    const acceptor = await this.getUserById(acceptedBy);

    const updatedListing: Listing = {
      ...listing,
      status: "accepted",
      acceptedBy,
      acceptedAt: new Date(),
      acceptorName: acceptor?.name || "Unknown",
    };
    this.listings.set(id, updatedListing);
    return updatedListing;
  }

  async updateListingStatus(id: number, status: "expired"): Promise<void> {
    const listing = this.listings.get(id);
    if (listing) {
      this.listings.set(id, { ...listing, status });
    }
  }

  async getListingsByUser(userId: number): Promise<Listing[]> {
    return Array.from(this.listings.values())
      .filter(listing => listing.createdBy === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAcceptedListings(ngoId: number): Promise<Listing[]> {
    return Array.from(this.listings.values())
      .filter(listing => listing.acceptedBy === ngoId)
      .sort((a, b) => b.acceptedAt!.getTime() - a.acceptedAt!.getTime());
  }

  async cleanExpiredListings(): Promise<void> {
    const now = new Date();
    for (const [id, listing] of this.listings) {
      if (listing.status === "available" && listing.expiresAt < now) {
        await this.updateListingStatus(id, "expired");
      }
    }
  }
}

export const storage = new MemStorage();