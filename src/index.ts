import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { configDotenv } from "dotenv";
import corsOptions from "./config/corsOptions.js";
import studentRouter from "./routers/student.js";
import authRouter from "./routers/auth.js";
import adminRouter from "./routers/admin.js";
import { connectDB } from "./config/connectDB.js";


const app = express();
const PORT = process.env.PORT || 4321;


configDotenv();
connectDB();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))


app.use("/auth", authRouter);
app.use("/admins", adminRouter);
app.use("/students", studentRouter);


app.listen(PORT, () => { console.log(`Server running on Port ${PORT}`); });