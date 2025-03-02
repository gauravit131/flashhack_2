import { User, InsertUser, Listing, InsertListing } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createListing(listing: InsertListing & { createdBy: number }): Promise<Listing>;
  getListing(id: number): Promise<Listing | undefined>;
  getActiveListings(): Promise<Listing[]>;
  acceptListing(id: number, acceptedBy: number): Promise<Listing | undefined>;
  updateListingStatus(id: number, status: "expired"): Promise<void>;
  getListingsByUser(userId: number): Promise<Listing[]>;
  getAcceptedListings(ngoId: number): Promise<Listing[]>;
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

  async createListing(listing: InsertListing & { createdBy: number }): Promise<Listing> {
    const id = this.currentListingId++;
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const newListing: Listing = {
      ...listing,
      id,
      status: "available",
      createdAt: new Date(),
      expiresAt,
      acceptedBy: null,
    };
    this.listings.set(id, newListing);
    return newListing;
  }

  async getListing(id: number): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async getActiveListings(): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.status === "available" && listing.expiresAt > new Date()
    );
  }

  async acceptListing(id: number, acceptedBy: number): Promise<Listing | undefined> {
    const listing = this.listings.get(id);
    if (!listing || listing.status !== "available") return undefined;

    const updatedListing: Listing = {
      ...listing,
      status: "accepted",
      acceptedBy,
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
    return Array.from(this.listings.values()).filter(
      (listing) => listing.createdBy === userId
    );
  }

  async getAcceptedListings(ngoId: number): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      (listing) => listing.acceptedBy === ngoId
    );
  }
}

export const storage = new MemStorage();