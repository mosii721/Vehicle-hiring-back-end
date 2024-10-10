import { Hono } from "hono";
import { Context } from "hono";
import { listVehicles, getVehicles, createVehicles, updateVehicles, deleteVehicles } from "./Vehicles.controller";
import { zValidator } from "@hono/zod-validator";
import { vehiclesSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const vehiclesRouter = new Hono();

// Get all vehicles
vehiclesRouter.get("/vehicles", listVehicles);
// Get a single vehicle
vehiclesRouter.get("/vehicles/:id", getVehicles);
// Create a vehicle
vehiclesRouter.post("/vehicles", zValidator('json', vehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicles);

// Update a vehicle
vehiclesRouter.put("/vehicles/:id", updateVehicles);

vehiclesRouter.get("/vehicles", zValidator('json', vehiclesSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicles);

// Delete a vehicle
vehiclesRouter.delete("/vehicles/:id", deleteVehicles);

vehiclesRouter.get("/vehicles", getVehicles);
