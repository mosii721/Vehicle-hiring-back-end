
import db from '../drizzle/db';
import { eq } from "drizzle-orm";
import { TIPayment, TSPayment } from '../drizzle/schema';
import { PaymentsTable, BookingsTable } from '../drizzle/schema';
import { stripe } from '../drizzle/db';

export const PaymentsService = async (): Promise<TSPayment[] | null> => {
  return await db.query.PaymentsTable.findMany();
};

export const getPaymentsService = async (id: number): Promise<TIPayment | undefined> => {
  return await db.query.PaymentsTable.findFirst({
    where: eq(PaymentsTable.payment_id, id),
  });
};

// Creating new payments
export const createPaymentsService = async (payment: TIPayment): Promise<{ message: string; client_secret: string | null } | undefined> => {
  if (payment.booking_id === undefined) {
    throw new Error("Booking ID is required");
  }

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(payment.amount) * 100,
    currency: 'usd',
    metadata: { booking_id: payment.booking_id },
  });

  // Save payment details to the database
  await db.insert(PaymentsTable).values({
    booking_id: payment.booking_id,
    amount: payment.amount,
    payment_status: 'Pending',
    payment_method: payment.payment_method,
    transaction_id: paymentIntent.id,
    payment_date: new Date(),
  }).execute();

  return { message: 'Payment created successfully', client_secret: paymentIntent.client_secret };
};

// Updating payments
export const updatePaymentsService = async (id: number, payment: TIPayment): Promise<string | undefined> => {
  await db.update(PaymentsTable).set(payment).where(eq(PaymentsTable.payment_id, id));
  return "Payment updated successfully";
};

// Deleting payments
export const deletePaymentsService = async (id: number): Promise<string | undefined> => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, id));
  return "Payment deleted successfully";
};

// Payment with other tables
export const PaymentWithOther = async () => {
  return await db.query.PaymentsTable.findMany({
    with: {
      booking: {
        columns: {
          user_id: true,
          booking_date: true,
          total_amount: true,
          booking_status: true,
        }
      }
    }
  });
};

// Function to cancel booking if payment not made within a certain time
export const cancelBookingIfPaymentNotMade = async (booking_id: number) => {
  // Get the current date and time
  const currentTime = new Date();

  // Get the booking details
  const booking = await db.query.BookingsTable.findFirst({
    where: eq(BookingsTable.booking_id, booking_id),
  });

  // Check if the booking exists and if the payment was made within the required time
  if (booking && booking.booking_date) {
    const bookingDate = new Date(booking.booking_date);
    const timeDifference = currentTime.getTime() - bookingDate.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    // If the payment was not made within 2 minutes, cancel the booking
    if (minutesDifference > 2) {
      await db.update(BookingsTable).set({ booking_status: 'Cancelled' }).where(eq(BookingsTable.booking_id, booking_id));
    }
  }
};

//update payment session_id
export const updatePaymentSessionIdService = async (session_id: string) =>{
  await db.update(PaymentsTable).set({payment_status: "Completed"}).where(eq(PaymentsTable.transaction_id, session_id)).execute();
  return 'PaymentSession updated successfully';
}