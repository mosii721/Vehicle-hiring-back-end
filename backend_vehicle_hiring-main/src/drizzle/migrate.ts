import "dotenv/config";
import {migrate} from "drizzle-orm/neon-http/migrator"
import {NeonHttpDatabase} from "drizzle-orm/neon-http"
import db from "./db";
 


const main = async () => {
  try{
    await migrate(db,{migrationsFolder: __dirname + "/migrations"});
    console.log("migration successful")
  }
  catch(e){
    console.error("error while migrating",e);
    process.exit(1);
  }
 }
main();



////postgresss
// async function migration(){

//     console.log("Migrating==========start=============");
//      await migrate(db, {migrationsFolder: __dirname + "/migrations"});
//      await client.end()
//      console.log("Migrating==========end=============");
//      process.exit(0);
     
//   }
//   migration().catch((err) => {
//     console.error(err);
//     process.exit(0);
//   })