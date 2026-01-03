import type { Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import prisma from "../config/connectDB.js";
import bcrypt from "bcryptjs";


export interface UserPayload { 
    id: string;
    email: string; }

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if(!email) return res.status(400).json({ message: "Email is required!" });
  if(!password) return res.status(400).json({ message: "Password is required!" });
  const foundAdmin = await prisma.admin.findUnique({ where: { email } });
  if(!foundAdmin) return res.status(404).json({ message: "User with email doesn't exist!" });
  const matches = await bcrypt.compare(password, foundAdmin.password!);
  if(!matches) return res.status(401).json({ message: "Password is incorrect!" });

  const payload = {
    id: foundAdmin.id,
    email: foundAdmin.email }

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN!,
    { expiresIn: "30m" }  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN!,
    { expiresIn: "1d" }  );

  try{await prisma.admin.update({ where: { email }, data: { refreshToken } });}
  catch(err) {return res.status(500).json({ message: "Couldn't save refresh token!" })}
  if(process.env.DEV_TYPE === "PROD") res.cookie("jwt", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
  else res.cookie("jwt", refreshToken, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
  return res.status(200).json({ user: payload, token: accessToken })  }

 
  
export const refresh = async (req: Request, res: Response) => {
  const { jwt: token } = req.cookies;
  if(!token)return res.status(403).json({ message: "Token is required for refresh!" });
  const foundAdmin = await prisma.admin.findFirst({ where: { refreshToken: token } });
  if(!foundAdmin)return res.status(403).json({ message: "Couldn't find admin with token!" });
  jwt.verify(
    token,
    process.env.REFRESH_TOKEN!,
    async (err: VerifyErrors | null, _decoded: JwtPayload | undefined | string) => {
      if(err) return res.status(401).json({ message: "Couldn't verify token!" });
      const payload = {
        id: foundAdmin.id,
        email: foundAdmin.email
      }
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN!,
        { expiresIn: "30m" });
      return res.status(200).json({ user: payload, token: accessToken });});}


    
export const signout = async (req: Request, res: Response) => {
  const {jwt: token} = req.cookies;
  if(!token)return res.status(403).json({ message: "Token is required for signout!" });
  const foundAdmin = await prisma.admin.findFirst({ where: { refreshToken: token } });
  if(!foundAdmin)return res.status(403).json({ message: "Couldn't find admin with token!" });
  const updatedAdmin = await prisma.admin.update({ where: { id: foundAdmin.id }, data: { refreshToken: "" } });
  if(!updatedAdmin) return res.status(500).json({ message: "Couldn't empty refreshToken!" });
  res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 });
  return res.status(200).json({ message: "Successfully signed out!" }); }