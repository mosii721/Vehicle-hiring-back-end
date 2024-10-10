import { Hono } from "hono";
import { Context } from "hono";
import { listFleet, getFleet, createFleet, updateFleet, deleteFleet } from "./Fleet.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"

export const fleetRouter = new Hono();

// get all fleets
fleetRouter.get("/fleet",listFleet);

// get a single fleet
fleetRouter.get("/fleet/:id", getFleet);

// create a fleet
fleetRouter.post("/fleet", zValidator('json', fleetSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createFleet);

// update a fleet
fleetRouter.put("/fleet/:id", updateFleet);

// delete fleet
fleetRouter.delete("/fleet/:id", deleteFleet);
