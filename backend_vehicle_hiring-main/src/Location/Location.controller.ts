import { Context } from "hono";
import { LocationsService, getLocationService, updateLocationService, createLocationService, deleteLocationService } from "./Location.service";

export const listLocations = async (c: Context) => {
  const data = await LocationsService();
  if (data == null || data.length == 0) {
    return c.text("Hello Ian, user not found", 404);
  }
  return c.json(data, 200);
};

// Getting Locations
export const getLocations = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const locations = await getLocationService(id);
  if (locations == undefined) {
    return c.text("User not found", 404);
  }
  return c.json(locations, 200);
};

// Creating Locations
export const createLocations = async (c: Context) => {
  try {
    const locations = await c.req.json();
    const createdLocations = await createLocationService(locations);
    if (!createdLocations) return c.text("User not created", 404);

    return c.json(createdLocations, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Updating Locations
export const updateLocations = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const locations = await c.req.json();
  // Search user
  const searchedLocations = await getLocationService(id);
  if (searchedLocations == undefined) return c.text("User not found", 404);

  // Get data and update
  const res = await updateLocationService(id, locations);

  // Return a success message
  if (!res) return c.text("User not updated", 404);
  return c.json({ msg: res }, 201);
};

// Deleting Locations
export const deleteLocations = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    // Search user
    const locations = await getLocationService(id);
    if (locations == undefined) return c.text("User not found", 404);
    // Delete user
    const res = await deleteLocationService(id);
    if (!res) return c.text("User not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
