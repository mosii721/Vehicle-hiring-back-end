import { Hono } from "hono";
import { Context } from "hono";
import { listPayments, getPayments, createPayments, updatePayments, deletePayments } from "./Payments.controller";
import { zValidator } from "@hono/zod-validator";
import { paymentsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const paymentsRouter = new Hono();

// Get all payments
paymentsRouter.get("/payments",adminRoleAuth, listPayments);
// Get a single payment
paymentsRouter.get("/payments/:id",adminRoleAuth, getPayments);
// Create a payment
paymentsRouter.post("/payments", zValidator('json', paymentsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createPayments);

// Update a payment
paymentsRouter.put("/payments/:id", updatePayments);

paymentsRouter.get("/payments", zValidator('json', paymentsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createPayments);

// Delete a payment
paymentsRouter.delete("/payments/:id", deletePayments);

paymentsRouter.get("/payments", getPayments);
