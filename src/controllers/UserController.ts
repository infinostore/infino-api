import { Request, Response } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";
import { decrypt, encrypt } from "../utils/encrypt_decrypt";
import { generateOTP, generateToken, sendOTPEmail } from "../utils/utils";

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

// In-memory storage for OTPs (replace with Redis or DB in production)
const otpStore: Record<string, string> = {};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Step 1: Check if the user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Step 2: Verify the password
        const decryptedPassword = decrypt(user.password);
        if (!decryptedPassword) {
            res.status(400).json({ message: 'Invalid email or password' });
            return
        }

        // Step 3: Generate and send OTP
        const otp = generateOTP();
        otpStore[user._id.toString()] = otp; // Store OTP in memory
        await sendOTPEmail(user.email, otp);

        // Step 4: Respond with a message to enter OTP
        res.status(200).json({ message: 'OTP sent to your email', userId: user._id });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        return
    }
};

// OTP Verification Endpoint
export const verifyOTP = async (req: Request, res: Response) => {
    const { userId, otp } = req.body;

    try {
        // Step 1: Check if the OTP matches
        const storedOTP = otpStore[userId];
        if (!storedOTP || storedOTP !== otp) {
            res.status(400).json({ message: 'Invalid OTP' });
            return;
        }

        // Step 2: Generate JWT token
        const token = generateToken(userId);

        // Step 3: Clear the OTP from memory
        delete otpStore[userId];

        // Step 4: Respond with the token
        res.status(200).json({ token });
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
        return
    }
};