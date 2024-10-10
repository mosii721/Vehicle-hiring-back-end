import db from '../drizzle/db';
import { eq,desc } from "drizzle-orm";
import { TIBooking, TSBooking } from '../drizzle/schema';
import { BookingsTable } from '../drizzle/schema';

export const bookingsService = async (): Promise<TSBooking[] | null> => {
  return await db.query.BookingsTable.findMany();
};

export const getBookingsService = async (id: number): Promise<TIBooking | undefined> => {
  return await db.query.BookingsTable.findFirst({
    where: eq(BookingsTable.booking_id, id)
  });
};



// Creating a new booking
export const createBookingsService = async (booking: TIBooking): Promise<TIBooking> => {
  const [newBooking] = await db.insert(BookingsTable).values(booking).returning();
  return newBooking;
};

// Updating booking
export const updateBookingsService = async (id: number, booking: TIBooking) => {
  await db.update(BookingsTable).set(booking).where(eq(BookingsTable.booking_id, id));
  return { msg: "Booking updated successfully" };
};

// Deleting booking
export const deleteBookingsService = async (id: number) => {
  await db.delete(BookingsTable).where(eq(BookingsTable.booking_id, id));
  return { msg: "Booking deleted successfully" };
};



/////booking with other Tables

export const BookingTableWithOtherTables = async()=>{

  return await db.query.BookingsTable.findMany({

    with:{
      location:true,
      vehicle:{
        columns:{
          vehicle_id:true
        
          
        }

      }
    }
  })
};

// Creating a new booking
export const newBookingsService = async (booking: TIBooking) :Promise<string | undefined>=> {
  await db.insert(BookingsTable).values(booking);
  return  "Booking created successfully" ;
};
