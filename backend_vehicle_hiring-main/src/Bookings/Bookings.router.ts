import { Hono } from "hono";
import { Context } from "hono";
import { listBookings, getBookings, createBookings, updateBookings, deleteBookings } from "./Bookings.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const bookingsRouter = new Hono();

// Get all bookings
bookingsRouter.get("/bookings", listBookings);
// Get a single booking
bookingsRouter.get("/bookings/:id", getBookings);


// Create a booking
bookingsRouter.post("/bookings", zValidator('json', bookingsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createBookings);

// Update a booking
bookingsRouter.put("/bookings/:id",userRoleAuth,updateBookings);

bookingsRouter.get("/bookings", zValidator('json', bookingsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createBookings);

// Delete a booking
bookingsRouter.delete("/bookings/:id", deleteBookings);

bookingsRouter.get("/bookings", getBookings);


bookingsRouter.get("/bookings/latest", getBookings);