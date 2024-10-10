import { relations } from "drizzle-orm";
import { pgTable, serial, varchar, text, integer, decimal, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["Pending", "Completed", "Failed"]);
export const statusEnum = pgEnum("status", ["Active","Inactive"])

// Users Table
export const UsersTable = pgTable('users', {
    user_id: serial("user_id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    address: text("address").notNull(),
    role: roleEnum("role").default("user").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Vehicle Specifications Table
export const VehicleSpecificationsTable = pgTable('vehicle_specifications', {
    vehicle_id: serial("vehicle_id").primaryKey(),
    manufacturer: varchar("manufacturer", { length: 255 }).notNull(),
    model: varchar("model", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    fuel_type: varchar("fuel_type", { length: 255 }).notNull(),
    engine_capacity: varchar("engine_capacity", { length: 255 }).notNull(),
    transmission: varchar("transmission", { length: 255 }).notNull(),
    seating_capacity: integer("seating_capacity").notNull(),
    color: varchar("color", { length: 255 }).notNull(),
    features: text("features").notNull()
});

// Vehicles Table
export const VehiclesTable = pgTable('vehicles', {
    vehicleSpec_id: serial("vehicleSpec_id").primaryKey(),
    vehicle_id: integer("vehicle_id").references(() => VehicleSpecificationsTable.vehicle_id, { onDelete: "cascade" }).notNull().unique(),
    rental_rate: decimal("rental_rate").notNull(),
    availability: statusEnum("availability").default("Active").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Bookings Table
export const BookingsTable = pgTable('bookings', {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),
    vehicle_id: integer("vehicle_id").references(() => VehicleSpecificationsTable.vehicle_id, { onDelete: "cascade" }).notNull(),
    location_id: integer("location_id").references(() => LocationTable.location_id, { onDelete: "cascade" }).notNull(),
    booking_date: timestamp("booking_date").notNull(),
    return_date: timestamp("return_date").notNull(),
    total_amount: decimal("total_amount").notNull(),
    booking_status: bookingStatusEnum("booking_status").default("Pending").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Payments Table
export const PaymentsTable = pgTable('payments', {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").references(() => BookingsTable.booking_id, { onDelete: "cascade" }).notNull().unique(),
    amount: decimal("amount").notNull(),
    payment_status: paymentStatusEnum("payment_status").default("Pending").notNull(),
    payment_date: timestamp("payment_date").notNull(),
    payment_method: varchar("payment_method", { length: 255 }).notNull(),
    transaction_id: varchar("transaction_id", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Authentication Table
export const AuthenticationTable = pgTable('authentication', {
    auth_id: serial("auth_id").primaryKey(),
    user_id: integer("user_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),

    
    password: varchar("password", { length: 255 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Customer Support Tickets Table
export const CustomerSupportTicketsTable = pgTable('customer_support_tickets', {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").references(() => UsersTable.user_id, { onDelete: "cascade" }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: statusEnum("status").default("Inactive").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Location and Branches Table
export const LocationTable = pgTable('location', {
    location_id: serial("location_id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Fleet Management Table
export const FleetManagementTable = pgTable('fleet_management', {
    fleet_id: serial("fleet_id").primaryKey(),
    vehicle_id: integer("vehicle_id").references(() => VehicleSpecificationsTable.vehicle_id, { onDelete: "cascade" }).notNull(),
    acquisition_date: timestamp("acquisition_date").defaultNow().notNull(),
    depreciation_rate: decimal("depreciation_rate").notNull(),
    current_value: decimal("current_value").notNull(),
    maintenance_cost: decimal("maintenance_cost").notNull(),
    status: statusEnum("status").default("Active").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

///////////////////////////////Relationships///////////////////////////////////////////

export const userRelations = relations(UsersTable, ({ many }) => ({
    bookings: many(BookingsTable),
    payments: many(PaymentsTable),
    auth: many(AuthenticationTable),
    tickets: many(CustomerSupportTicketsTable)
}));

export const vehicleRelations = relations(VehicleSpecificationsTable, ({ one, many }) => ({
    vehicles: many(VehiclesTable),
    bookings: many(BookingsTable),
    fleet: many(FleetManagementTable)
}));

export const bookingRelations = relations(BookingsTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [BookingsTable.user_id],
        references: [UsersTable.user_id]
    }),
    vehicle: one(VehicleSpecificationsTable, {
        fields: [BookingsTable.vehicle_id],
        references: [VehicleSpecificationsTable.vehicle_id]
    }),
    location: one(LocationTable, {
        fields: [BookingsTable.location_id],
        references: [LocationTable.location_id]
    }),
   
}));

export const paymentRelations = relations(PaymentsTable, ({ one }) => ({
    booking: one(BookingsTable, {
        fields: [PaymentsTable.booking_id],
        references: [BookingsTable.booking_id]
    })
}));

export const authRelations = relations(AuthenticationTable, ({ one}) => ({
    user: one(UsersTable, {
        fields: [AuthenticationTable.user_id],
        references: [UsersTable.user_id]
    })
}));

export const ticketRelations = relations(CustomerSupportTicketsTable, ({ one }) => ({
    user: one(UsersTable, {
        fields: [CustomerSupportTicketsTable.user_id],
        references: [UsersTable.user_id]
    })
}));

export const fleetRelations = relations(FleetManagementTable, ({ one }) => ({
    vehicle: one(VehicleSpecificationsTable, {
        fields: [FleetManagementTable.vehicle_id],
        references: [VehicleSpecificationsTable.vehicle_id]
    })
}));

export const locationRelations = relations(LocationTable, ({ many }) => ({
    bookings: many(BookingsTable)
}));

// Types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;
export type TIVehicleSpec = typeof VehicleSpecificationsTable.$inferInsert;
export type TSVehicleSpec = typeof VehicleSpecificationsTable.$inferSelect;
export type TIVehicle = typeof VehiclesTable.$inferInsert;
export type TSVehicle = typeof VehiclesTable.$inferSelect;
export type TIBooking = typeof BookingsTable.$inferInsert;
export type TSBooking = typeof BookingsTable.$inferSelect;
export type TIPayment = typeof PaymentsTable.$inferInsert;
export type TSPayment = typeof PaymentsTable.$inferSelect;
export type TIAuth = typeof AuthenticationTable.$inferInsert;
export type TSAuth = typeof AuthenticationTable.$inferSelect;
export type TITicket = typeof CustomerSupportTicketsTable.$inferInsert;
export type TSTicket = typeof CustomerSupportTicketsTable.$inferSelect;
export type TILocation = typeof LocationTable.$inferInsert;
export type TSLocation = typeof LocationTable.$inferInsert;
export type TSfleet = typeof FleetManagementTable.$inferInsert
export type TIfleet = typeof FleetManagementTable.$inferInsert
