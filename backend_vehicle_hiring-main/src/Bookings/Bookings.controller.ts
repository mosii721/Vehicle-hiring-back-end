import { Context } from "hono";
import { bookingsService, getBookingsService, updateBookingsService, createBookingsService, deleteBookingsService } from "./Bookings.service";

export const listBookings = async (c: Context) => {
  const data = await bookingsService();
  if (data == null || data.length == 0) {
    return c.text("Hello Ian, user not found", 404);
  }
  return c.json(data, 200);
};

// Getting Bookings
export const getBookings = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const bookings = await getBookingsService(id);
  if (bookings == undefined) {
    return c.text("User not found", 404);
  }
  return c.json(bookings, 200);
};

// Creating Bookings
export const createBookings = async (c: Context) => {
  try {

    const bookings = await c.req.json();

    //convert date strings to date objects
    if(bookings.booking_date){
      bookings.booking_date = new Date(bookings.booking_date);
  }
  if(bookings.return_date){
      bookings.return_date = new Date(bookings.return_date);
  }
    const createdBookings = await createBookingsService(bookings);
    if (!createdBookings) return c.text("User not created", 404);

    return c.json(createdBookings, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Updating Bookings
export const updateBookings = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const bookings = await c.req.json();
  // Search user
  const searchedBookings = await getBookingsService(id);
  if (searchedBookings == undefined) return c.text("User not found", 404);

  // Get data and update
  const res = await updateBookingsService(id, bookings);

  // Return a success message
  if (!res) return c.text("User not updated", 404);
  return c.json({ msg: res }, 201);
};

// Deleting Bookings
export const deleteBookings = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    // Search user
    const bookings = await getBookingsService(id);
    if (bookings == undefined) return c.text("User not found", 404);
    // Delete user
    const res = await deleteBookingsService(id);
    if (!res) return c.text("User not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};



