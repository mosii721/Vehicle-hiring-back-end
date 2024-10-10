import { Context } from "hono";
import { fleetService, getFleetService, updateFleetService, createFleetService, deleteFleetService } from "./Fleet.service";

export const listFleet = async (c: Context) => {
  const data = await fleetService();
  if (data == null || data.length == 0) {
    return c.text("hello Ian user not found", 404);
  }
  return c.json(data, 200);
};

// getting fleet
export const getFleet = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const fleet = await getFleetService(id);
  if (fleet === undefined) {
    return c.text("user not found", 404);
  }
  return c.json(fleet, 200);
};

// creating fleet
export const createFleet = async (c: Context) => {
  try {

   

    const fleet = await c.req.json();

     //convert date strings to date objects
     if(fleet.acquisition_date){
      fleet.acquisition_date = new Date(fleet.acquisition_date);
  }

    const createdFleet = await createFleetService(fleet);
    if (!createdFleet) return c.text("Fleet not created", 404);

    return c.json(createdFleet, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// updating fleet
export const updateFleet = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const fleet = await c.req.json();
  
  // search fleet
  const searchedFleet = await getFleetService(id);
  if (searchedFleet === undefined) return c.text("Fleet not found", 404);

  // update data
  const res = await updateFleetService(id, fleet);

  // return success message
  if (!res) return c.text("Fleet not updated", 404);
  return c.json({ msg: res }, 201);
};

// deleting fleet
export const deleteFleet = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("invalid Id", 400);
  try {
    // search fleet
    const fleet = await getFleetService(id);
    if (fleet === undefined) return c.text("Fleet not found", 404);
    
    // delete fleet
    const res = await deleteFleetService(id);
    if (!res) return c.text("Fleet not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
