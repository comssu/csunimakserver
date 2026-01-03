import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserPayload } from "../controllers/auth.js";

export interface ReqWithUser extends Request {
  user: UserPayload
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
  if(!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).json({ message: "AuthHeader is required!" });
  const token = authHeader.split(" ")[1];
  if(!token) return res.status(401).json({ message: "Access Token is required!" });
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN!,
    (error: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if(error) return res.status(403).json({ message: error.message });
      const payload: UserPayload = { id: (decoded as UserPayload).id, email: (decoded as UserPayload).email, };
      (req as ReqWithUser).user = payload;
      next();
    }
  )
}


export default verifyJWT;