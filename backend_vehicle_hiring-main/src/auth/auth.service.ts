  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../drizzle/db";
import { UsersTable, AuthenticationTable } from "../drizzle/schema";
import { userSchema,authSchema, loginSchema } from "../validators";
import { eq } from "drizzle-orm";
 
const secret = process.env.SECRET;
const expiresIn = process.env.EXPIRESIN
 
export const registerUser = async (user: any) => {
    userSchema.parse(user);
    authSchema.parse(user);
 
    //check if user already exists
    const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, user.email)).execute();
 
    if(existingUser.length > 0){
        throw new Error("User already exists");
    }
 
    //Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
 
    //inser data into the Users table
    const newUser = await db.insert(UsersTable)
    .values({
        full_name: user.full_name,
        email: user.email,
        contact_phone: user.contact_phone,
        address: user.address,
        role: user.role
    })
    .returning({id: UsersTable.user_id})
    .execute();
 
    //insert data into the Authentication table
    const userId = newUser[0].id;
 
    try {
        await db.insert(AuthenticationTable)
        .values({
            user_id: userId,
            password: hashedPassword
        })
        .execute();
        return 'User registered successfully';
    } catch (error) {
        // Rollback: delete the user from the Users table if the second insert fails
        await db.delete(UsersTable).where(eq(UsersTable.user_id, userId)).execute();
        throw new Error('Registration failed. Please try again.');
    }
}
 
export const loginUser = async (email: string, password: string) => {
    // Validate login data against the login schema
    loginSchema.parse({ email, password });
 
    // Fetch the user by email
    const users = await db.select().from(UsersTable).where(eq(UsersTable.email, email)).execute();
 
    if (users.length === 0) {
        throw new Error('User not found! Try Again');
    }
 
    const user = users[0];
 
    // Fetch the user's hashed password from the Authentication table
    const auths = await db.select().from(AuthenticationTable).where(eq(AuthenticationTable.user_id, user.user_id)).execute();
 
    if (auths.length === 0) {
        throw new Error('Invalid credentials! Try again');
    }
 
    const auth = auths[0];
 
    // Validate the provided password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, auth.password);
 
    if (!isPasswordValid) {
        throw new Error('Invalid credentials! Try again');
    }
 
    // Create a JWT token
    const token = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        secret!,
        { expiresIn }
    );
 
    return { token, user }; //token here
};
 