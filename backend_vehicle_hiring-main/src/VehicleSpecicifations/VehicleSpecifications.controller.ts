import { Context } from "hono";
import { vehicleSpecificationsService, getVehicleSpecificationsService, updateVehicleSpecificationsService, createVehicleSpecificationsService, deleteVehicleSpecificationsService } from "./VehicleSpecifications.service";

export const listVehicleSpecifications = async (c: Context) => {
  const data = await vehicleSpecificationsService();
  if (data == null || data.length == 0) {
    return c.text("Hello Ian, user not found", 404);
  }
  return c.json(data, 200);
};

// Getting VehicleSpecifications
export const getVehicleSpecifications = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const vehicleSpecifications = await getVehicleSpecificationsService(id);
  if (vehicleSpecifications == undefined) {
    return c.text("User not found", 404);
  }
  return c.json(vehicleSpecifications, 200);
};

// Creating VehicleSpecifications
export const createVehicleSpecifications = async (c: Context) => {
  try {
    const vehicleSpecifications = await c.req.json();
    const createdVehicleSpecifications = await createVehicleSpecificationsService(vehicleSpecifications);
    if (!createdVehicleSpecifications) return c.text("User not created", 404);

    return c.json(createdVehicleSpecifications, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Updating VehicleSpecifications
export const updateVehicleSpecifications = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const vehicleSpecifications = await c.req.json();
  // Search user
  const searchedVehicleSpecifications = await getVehicleSpecificationsService(id);
  if (searchedVehicleSpecifications == undefined) return c.text("User not found", 404);

  // Get data and update
  const res = await updateVehicleSpecificationsService(id, vehicleSpecifications);

  // Return a success message
  if (!res) return c.text("User not updated", 404);
  return c.json({ msg: res }, 201);
};

// Deleting VehicleSpecifications
export const deleteVehicleSpecifications = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    // Search user
    const vehicleSpecifications = await getVehicleSpecificationsService(id);
    if (vehicleSpecifications == undefined) return c.text("User not found", 404);
    // Delete user
    const res = await deleteVehicleSpecificationsService(id);
    if (!res) return c.text("User not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
