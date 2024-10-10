import { Context } from "hono";
import { customerSupportService, getCustomerSupportService, updateCustomerSupportService, createCustomerSupportService, deleteCustomerSupportService } from "./CustomerSupport.service";

export const listCustomerSupport = async (c: Context) => {
  const data = await customerSupportService();
  if (data == null || data.length == 0) {
    return c.text("Hello Ian, user not found", 404);
  }
  return c.json(data, 200);
};

// Getting Customer Support
export const getCustomerSupport = async (c: Context) => {
  const id = parseInt(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);

  const customerSupport = await getCustomerSupportService(id);
  if (customerSupport == undefined) {
    return c.text("User not found", 404);
  }
  return c.json(customerSupport, 200);
};

// Creating Customer Support
export const createCustomerSupport = async (c: Context) => {
  try {
    const customerSupport = await c.req.json();
    const createdCustomerSupport = await createCustomerSupportService(customerSupport);
    if (!createdCustomerSupport) return c.text("User not created", 404);

    return c.json(createdCustomerSupport, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};

// Updating Customer Support
export const updateCustomerSupport = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const customerSupport = await c.req.json();
  // Search user
  const searchedCustomerSupport = await getCustomerSupportService(id);
  if (searchedCustomerSupport == undefined) return c.text("User not found", 404);

  // Get data and update
  const res = await updateCustomerSupportService(id, customerSupport);

  // Return a success message
  if (!res) return c.text("User not updated", 404);
  return c.json({ msg: res }, 201);
};

// Deleting Customer Support
export const deleteCustomerSupport = async (c: Context) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.text("Invalid ID", 400);
  try {
    // Search user
    const customerSupport = await getCustomerSupportService(id);
    if (customerSupport == undefined) return c.text("User not found", 404);
    // Delete user
    const res = await deleteCustomerSupportService(id);
    if (!res) return c.text("User not deleted", 404);
    return c.json({ msg: res }, 201);
  } catch (error: any) {
    return c.json({ error: error?.message }, 400);
  }
};
