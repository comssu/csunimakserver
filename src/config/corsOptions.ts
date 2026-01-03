import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins.js";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if(allowedOrigins.includes(origin!) || !origin) callback(null, true);
    else callback(new Error("Not Allowed by CORS!"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
}


export default corsOptions;