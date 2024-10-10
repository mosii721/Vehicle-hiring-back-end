import db from '../drizzle/db';
import { eq } from "drizzle-orm";
import { TILocation, TSLocation } from '../drizzle/schema'; // Updated import
import { LocationTable } from '../drizzle/schema'; // Updated import

// Service to fetch all locations
export const LocationsService = async (): Promise<TSLocation[] | null> => {
  return await db.query.LocationTable.findMany(); // Updated table reference
};

// Service to fetch a location by ID
export const getLocationService = async (id: number): Promise<TILocation | undefined> => {
  return await db.query.LocationTable.findFirst({
    where: eq(LocationTable.location_id, id) // Updated table reference
  });
};

// Service to create a new location
export const createLocationService = async (location: TILocation) :Promise<string | undefined> => {
  await db.insert(LocationTable).values(location); 
  return "Location created successfully" ;
};

// Service to update a location
export const updateLocationService = async (id: number, location: TILocation) => {
  await db.update(LocationTable).set(location).where(eq(LocationTable.location_id, id)); // Updated table reference
  return { msg: "Location updated successfully" };
};

// Service to delete a location
export const deleteLocationService = async (id: number) => {
  await db.delete(LocationTable).where(eq(LocationTable.location_id, id)); // Updated table reference
  return { msg: "Location deleted successfully" };
};
