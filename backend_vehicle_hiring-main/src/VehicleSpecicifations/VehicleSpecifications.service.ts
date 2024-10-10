import db from '../drizzle/db';
import { eq } from "drizzle-orm";
import { TIVehicleSpec, TSVehicleSpec } from '../drizzle/schema';
import { VehicleSpecificationsTable } from '../drizzle/schema';

export const vehicleSpecificationsService = async (): Promise<TSVehicleSpec[] | null> => {
  return await db.query.VehicleSpecificationsTable.findMany();
};

export const getVehicleSpecificationsService = async (id: number): Promise<TIVehicleSpec | undefined> => {
  return await db.query.VehicleSpecificationsTable.findFirst({
    where: eq(VehicleSpecificationsTable.vehicle_id, id)
  });
};

// Creating a new vehicle specification
export const createVehicleSpecificationsService = async (vehicleSpecification: TIVehicleSpec) :Promise<string | undefined> => {
  await db.insert(VehicleSpecificationsTable).values(vehicleSpecification);
  return  "vehiclespec created successfully" ;
};

// Updating vehicle specification
export const updateVehicleSpecificationsService = async (id: number, vehicleSpecification: TIVehicleSpec) => {
  await db.update(VehicleSpecificationsTable).set(vehicleSpecification).where(eq(VehicleSpecificationsTable.vehicle_id, id));
  return { msg: "vehicleSpec updated successfully" };
};

// Deleting vehicle specification
export const deleteVehicleSpecificationsService = async (id: number) => {
  await db.delete(VehicleSpecificationsTable).where(eq(VehicleSpecificationsTable.vehicle_id, id));
  return { msg: "Vehiclespec deleted successfully" };
};


///with other tables
 export const VehicleWithOthersService = async()=>{
  return await db.query.VehicleSpecificationsTable.findMany({
    with:{
      vehicles:{
        columns:{
          vehicle_id:true,
          rental_rate:true,
          availability:true
         }
      },
      fleet:{
        columns:{
          
        }
      }
    }
  });
 }
