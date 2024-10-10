
import {eq} from "drizzle-orm";
 import db from "../drizzle/db";
 import { TIUser,TSUser, UsersTable } from "../drizzle/schema";
 


 export const usersService =  async (): Promise<TSUser[] |null> => {
    return await db.query.UsersTable.findMany();

 }

 export const getuserService = async (id: number): Promise<TIUser | undefined> => {
   return await db.query.UsersTable.findFirst({
      where : eq(UsersTable.user_id, id),
      with:{
         bookings:true,
         
      }
   })
 }

 //creating a new user
 export const createUserService = async (user: TIUser) :Promise<string | undefined> => {
       await db.insert(UsersTable).values(user)
    return "User created successfully";
 }


 //updating users
 export const updateUserService = async (id: number, user: TIUser) => {
     await db.update(UsersTable).set(user).where(eq(UsersTable.user_id, id))
    return { msg:"User updated successfully"}
 }

 //deleting users
 export const deleteUserService = async (id: number) => {
     await db.delete(UsersTable).where(eq(UsersTable.user_id, id))
    return { msg:"User deleted successfully"}
 }
 



 ////connection with other tables

 export const userWithOthersService = async ()=> {

   return await db.query.UsersTable.findMany({
      with:{
         bookings:true,
         tickets:{
            columns:{
               ticket_id:true,
               subject:true,
               description:true,
               status:true


            }
         }
         
      }
   })
 }