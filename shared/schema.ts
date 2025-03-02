import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["helper", "ngo"] }).notNull(),
  name: text("name").notNull(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  quantity: text("quantity").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  locality: text("locality").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  createdBy: integer("created_by").notNull(),
  creatorName: text("creator_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  status: text("status", { enum: ["available", "accepted", "expired"] }).notNull(),
  acceptedBy: integer("accepted_by"),
  acceptorName: text("acceptor_name"),
  acceptedAt: timestamp("accepted_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
});

export const insertListingSchema = createInsertSchema(listings)
  .pick({
    title: true,
    description: true,
    quantity: true,
    mobileNumber: true,
    locality: true,
    city: true,
    state: true,
    pincode: true,
  })
  .extend({
    mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;