import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import { JWT_USER_SECRET } from '../config';
dotenv.config();


// Password hashing
// export const hashPassword = async (password: string): Promise<string> => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// };

// Password comparison
// export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//     return await bcrypt.compare(password, hashedPassword);
// };

// Generate JWT token
export const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, JWT_USER_SECRET || 'your-secret-key', { expiresIn: '1h' });
};

// Generate random OTP
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_VERIFICATION,
            pass: process.env.EMAIL_VERIFICATION_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_VERIFICATION,
        to: email,
        subject: 'OTP for Login',
        text: `Your OTP for login is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};