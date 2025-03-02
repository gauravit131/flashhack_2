import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { setupWebSocket } from "./websocket";
import { storage } from "./storage";
import { insertListingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  const httpServer = createServer(app);
  const ws = setupWebSocket(httpServer);

  app.get("/api/users/count", async (req, res) => {
    const count = await storage.getUserCount();
    res.json({ count });
  });

  app.get("/api/listings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const sortKey = req.query.sort as string;
    const sortOrder = req.query.order as string;

    const sort = sortKey && sortOrder ? { key: sortKey, order: sortOrder } : undefined;
    const listings = await storage.getActiveListings(sort);
    res.json(listings);
  });

  app.post("/api/listings", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "helper") return res.sendStatus(403);

    const result = insertListingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const listing = await storage.createListing({
      ...result.data,
      createdBy: req.user.id,
    });

    res.status(201).json(listing);
  });

  app.post("/api/listings/:id/accept", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "ngo") return res.sendStatus(403);

    const listing = await storage.getListing(parseInt(req.params.id));
    if (!listing) return res.status(404).send("Listing not found");
    if (listing.status !== "available") return res.status(400).send("Listing not available");
    if (listing.expiresAt < new Date()) {
      await storage.updateListingStatus(listing.id, "expired");
      ws.broadcast({ type: "listing_expired", listing });
      return res.status(400).send("Listing expired");
    }

    const updatedListing = await storage.acceptListing(listing.id, req.user.id);
    if (!updatedListing) return res.status(400).send("Failed to accept listing");

    ws.broadcast({ type: "listing_accepted", listing: updatedListing });
    res.json(updatedListing);
  });

  app.get("/api/listings/my-donations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "helper") return res.sendStatus(403);

    const listings = await storage.getListingsByUser(req.user.id);
    res.json(listings);
  });

  app.get("/api/listings/accepted", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "ngo") return res.sendStatus(403);

    const listings = await storage.getAcceptedListings(req.user.id);
    res.json(listings);
  });

  return httpServer;
}