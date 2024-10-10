import { Hono } from "hono";
import { Context } from "hono";
import { listVehicleSpecifications, getVehicleSpecifications, createVehicleSpecifications, updateVehicleSpecifications, deleteVehicleSpecifications } from "./VehicleSpecifications.controller";
import { zValidator } from "@hono/zod-validator";
import { vehicleSpecificationsSchema } from "../validators";
import { adminRoleAuth,userRoleAuth } from "../middleware/middleAuth"


export const vehicleSpecificationsRouter = new Hono();

// Get all vehicle specifications
vehicleSpecificationsRouter.get("/vehicle-specifications",adminRoleAuth, listVehicleSpecifications);
// Get a single vehicle specification
vehicleSpecificationsRouter.get("/vehicle-specifications/:id",adminRoleAuth, getVehicleSpecifications);
// Create a vehicle specification
vehicleSpecificationsRouter.post("/vehicle-specifications", zValidator('json', vehicleSpecificationsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicleSpecifications);

// Update a vehicle specification
vehicleSpecificationsRouter.put("/vehicle-specifications/:id", updateVehicleSpecifications);

// Create a vehicle specification (duplicate route fixed)
vehicleSpecificationsRouter.post("/vehicle-specifications", zValidator('json', vehicleSpecificationsSchema, (result, c) => {
  if (!result.success) {
    return c.json(result.error, 400);
  }
}), createVehicleSpecifications);

// Delete a vehicle specification
vehicleSpecificationsRouter.delete("/vehicle-specifications/:id", deleteVehicleSpecifications);

// Get a single vehicle specification (duplicate route fixed)
vehicleSpecificationsRouter.get("/vehicle-specifications/:id", getVehicleSpecifications);
