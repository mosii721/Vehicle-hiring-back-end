import { Context } from "hono";
import { VehiclesService, getVehiclesService, updateVehiclesService, createVehiclesService, deleteVehiclesService } from "./Vehicles.service";

export const listVehicles = async (c: Context) => {
  const data = await VehiclesService();
  if (data == null || data.length == 0) {
    return c.text("hello Ian user not found", 404);
  }

  return c.json(data, 200);
};

// Getting vehicles
export const getVehicles = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const vehicle = await getVehiclesService(id);
  if (vehicle == undefined) {
    return c.text("user not found", 404);
  }
  return c.json(vehicle, 200);
};

// Creating vehicles
export const createVehicles = async (c: Context) => {
  try {
    const vehicle = await c.req.json();
    const createdVehicle = await createVehiclesService(vehicle);
    if (!createdVehicle) return c.text("User not created", 404);

    return c.json(createdVehicle, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Updating vehicles
export const updateVehicles = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const vehicle = await c.req.json();
  // Search user
  const searchedVehicle = await getVehiclesService(id);
  if (searchedVehicle == undefined) return c.text("User not found", 404);

  // Get data and update
  const res = await updateVehiclesService(id, vehicle);

  // Return a success message
  if (!res) return c.text("User not updated", 404);
  return c.json({ msg: res }, 201);
};

// Deleting vehicles
export const deleteVehicles = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("invalid Id", 400);
  try {
    // Search user
    const vehicle = await getVehiclesService(id);
    if (vehicle == undefined) return c.text("User not found", 404);
    // Delete user
    const res = await deleteVehiclesService(id);
    if (!res) return c.text("User not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
