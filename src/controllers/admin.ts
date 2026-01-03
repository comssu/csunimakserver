import { Request, Response } from "express";
import prisma from "../config/connectDB.js";
import bcrypt from "bcryptjs";

export const addAdmin = async (req: Request, res: Response) => {
  const { email } = req.body;
  if(!email) return res.status(400).json({ message: "Email is required!" });
  try{
    await prisma.admin.create({
      data: { email }
    });
    return res.status(200).json({ message: `Successfully aded ${email} as an Admin.` });
  } catch(err){
    console.error(err);
    return res.status(500).json({ message: "Server Error: Unable to add Admin" });
  }
}

export const updatePassword = async (req: Request, res: Response) => {
  const { newpassword, currentpassword, email } = req.body;
  if(!email) return res.status(400).json({ message: "Email is required!" });
  if(!currentpassword) return res.status(400).json({ message: "Current password is required!" });
  if(!newpassword) return res.status(400).json({ message: "New password is required!" });
  const foundAdmin = await prisma.admin.findUnique({ where: { email } });
  if(!foundAdmin) return res.status(404).json({ message: "Admin with email doesn't exist!" });
  const matches = await bcrypt.compare(currentpassword, foundAdmin.password);
  if(!matches) return res.status(401).json({ message: "Your current password doesn't match!" });
  const hashPwd = await bcrypt.hash(newpassword, 12);
  try{
    await prisma.admin.update({
      where: { email },
      data: { password: hashPwd }
    });
    return res.status(200).json({ message: `Successfully updated ${email}'s password.` });
  } catch(err){
    console.error(err);
    return res.status(500).json({ message: "Server Error: Unable to add Admin" });
  }
}