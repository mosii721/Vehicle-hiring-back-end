import db from '../drizzle/db';
import { eq } from "drizzle-orm";
import { TITicket, TSTicket } from '../drizzle/schema';
import { CustomerSupportTicketsTable } from '../drizzle/schema';

export const customerSupportService = async (): Promise<TSTicket[] | null> => {
  return await db.query.CustomerSupportTicketsTable.findMany();
};

export const getCustomerSupportService = async (id: number): Promise<TITicket | undefined> => {
  return await db.query.CustomerSupportTicketsTable.findFirst({
    where: eq(CustomerSupportTicketsTable.ticket_id, id),
    with:{
      user:{
        columns:{
          full_name:true,
          email:true,
          address:true



        }
      }
     
    }
  });
};

// Creating a new customer support entry
export const createCustomerSupportService = async (customerSupport: TITicket) => {
  await db.insert(CustomerSupportTicketsTable).values(customerSupport);
  return { msg: "User created successfully" };
};

// Updating customer support entry
export const updateCustomerSupportService = async (id: number, customerSupport: TITicket) => {
  await db.update(CustomerSupportTicketsTable).set(customerSupport).where(eq(CustomerSupportTicketsTable.ticket_id, id));
  return { msg: "User updated successfully" };
};

// Deleting customer support entry
export const deleteCustomerSupportService = async (id: number) => {
  await db.delete(CustomerSupportTicketsTable).where(eq(CustomerSupportTicketsTable.ticket_id, id));
  return { msg: "User deleted successfully" };
};



///customersupport with other tables
export const CustomerSupportWithOthersService = async () => {
         
  return await db.query.CustomerSupportTicketsTable.findMany({
     with : {
      user:{
        columns:{
          full_name:true,
          email:true,
          address:true



        }
      }
     }
    })
  }