import { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";
import { encrypt } from "../utils/encrypt_decrypt";

// Input Validation VIA ZOD, Schema for the body for signup:
const signupValidationSchema = z.object({
    fullName: z.string().min(1, { message: 'FullName is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    contactNumber: z.number(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signup = async (req: Request, res: Response) => {

    try {
        // Validate the request body
        const result = signupValidationSchema.safeParse(req.body);

        // If validation fails, return an error
        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.flatten().fieldErrors,
            });
            return
        }

        const { fullName, email, contactNumber, password } = result.data;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return
        }


        const encryptedPassword = encrypt(password);

        // Create a new user
        const user = new UserModel({ fullName, email, contactNumber, password: encryptedPassword });
        await user.save();

        // Return success response
        res.status(201).json({ message: `${fullName} registered successfully!` });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }



}