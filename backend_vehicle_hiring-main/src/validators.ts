 

   import { z } from "zod";

    // Users
    export const userSchema = z.object({
        user_id: z.number().default(0),
        full_name: z.string(),
        email: z.string().email(),
        contact_phone:z.number(),
        address:z.string(),
        role: z.enum(["admin", "user"]).default("user"),
       
    });

      ///// user
       export const authSchema = z.object({
        user_id: z.number().default(0), 
       
      
        role: z.enum(["admin", "user"]),
        password: z.string(),
       });

       ///login user
       export const loginSchema = z.object({
        email: z.string().email(),
        password: z.string(),
       });


    //vehicles
    export const vehiclesSchema = z.object({
        vehicleSpec_id: z.number().default(0),
        vehicle_id: z.number(),
        rental_rate: z.number(),
        availability: z.enum(["Active", "Inactive"]).default("Active"),
       
    });

    //Vehicle Specifications
    export const vehicleSpecificationsSchema = z.object({
        vehicle_id: z.number().default(0),
        manufacturer: z.string(),
        model: z.string(),
        year: z.number(),
        engine_capacity: z.number(),
        fuel_type: z.string(),
        transmission:z.string(),
        seating_capacity:z.number(),
        color: z.string(),
        features: z.string()
       
    });


   // Bookings 
export const bookingsSchema = z.object({
    booking_id: z.number().default(0),
    user_id: z.number().transform((value) => Number(value)),
    vehicle_id: z.number().transform((value) => Number(value)),
    location_id: z.number().transform((value) => Number(value)),
    booking_date: z.preprocess((arg) => new Date(arg as string), z.date()),
    return_date:  z.preprocess((arg) => new Date(arg as string), z.date()),
    total_amount: z.number(),
    booking_status: z.enum(["Pending", "Confirmed", "Cancelled"]),
});

    //Payment table
    export const paymentsSchema = z.object({
        payment_id: z.number().default(0),
        booking_id: z.any(),
        payment_method: z.any(),
        amount: z.any(),
       payment_date: z.any(),
        transaction_id: z.any(),
        payment_status: z.any(),
       
    });

    //CustomerSupport
    export const customerSupportSchema = z.object({
        ticket_id: z.number().default(0),
        user_id: z.number(),
        subject: z.string(),
        description: z.string(),
        status: z.enum(["Active", "Inactive"])
       
    });

    //Location
    export const locationsSchema = z.object({
        location_id: z.number().default(0),
        name: z.string(),
        address: z.string(),
        contact_phone: z.number(),
       
    });

    //Fleet
    export const fleetSchema = z.object({
        fleet_id: z.number().default(0),
        vehicle_id: z.number(),
        acquisition_date: z.preprocess((arg) => new Date(arg as string), z.date()),
        depreciation_rate: z.number(),
        current_value: z.number(),
        maintenance_cost: z.number(),
        status: z.enum(["Active", "Inactive"]),
       
    });

