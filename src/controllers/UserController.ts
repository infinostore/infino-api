import { Request , Response } from "express";

export const home = (req:Request , res:Response) => {
    res.send("Backend is under development!!, This is for Testing!!")
}