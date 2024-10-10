import db from '../drizzle/db';
import { eq } from "drizzle-orm";
import { TIfleet, TSfleet } from '../drizzle/schema';
import { FleetManagementTable } from '../drizzle/schema';

export const fleetService = async (): Promise<TSfleet[] | null> => {
  return await db.query.FleetManagementTable.findMany();
};

export const getFleetService = async (id: number): Promise<TIfleet | undefined> => {
  return await db.query.FleetManagementTable.findFirst({
    where: eq(FleetManagementTable.fleet_id, id),
    with :{
      vehicle:{
        columns:{
          vehicle_id:true,
         
          model:true,
          year:true,
          color:true,
           fuel_type:true,
          
        }
      }
    }
  });
};

// creating a new fleet
export const createFleetService = async (fleet: TIfleet) :Promise<string | undefined>=> {
  await db.insert(FleetManagementTable).values(fleet);
  return  "Fleet created successfully" ;
};

// updating fleet
export const updateFleetService = async (id: number, fleet: TIfleet) :Promise<string | undefined>=> {
  await db.update(FleetManagementTable).set(fleet).where(eq(FleetManagementTable.fleet_id, id));
  return "Fleet updated successfully" ;
};

// deleting fleet
export const deleteFleetService = async (id: number) => {
  await db.delete(FleetManagementTable).where(eq(FleetManagementTable.fleet_id, id));
  return { msg: "Fleet deleted successfully" };
};



///fleet with other tables

export const FleetWithOtherTables = async()=>{
  return await db.query.FleetManagementTable.findMany({
    with :{
      vehicle:{
        columns:{
          vehicle_id:true,
         
          model:true,
          year:true,
          color:true,
           fuel_type:true,
          
        }
      }
    }
  });
}