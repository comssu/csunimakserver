import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { configDotenv } from "dotenv";
import { Pool } from "pg";


configDotenv();


const pool = new Pool({ connectionString: process.env.DATABASE_URI! });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try{
    await prisma.$connect();
    console.log("✅Successfully connected to Database!")
  } catch(err) {console.log("Failed to connect to Database!");
}}

export default prisma;