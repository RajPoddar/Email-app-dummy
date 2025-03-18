import { NextResponse } from "next/server";
import admin from "firebase-admin";
import nodemailer from "nodemailer";



// Initialize Firebase Admin SDK (Make sure you set the env variable in Vercel)
if (!admin.apps.length) {
    const credentials = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(credentials),
    });
}

// Nodemailer setup (Use environment variables for security)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail
        pass: process.env.EMAIL_PASS,  // Your App Password (not Gmail password)
    },
});

// **API Route**
export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        // Generate Firebase email verification link
        const actionCodeSettings = {
            url: `https://email.pressknow.com/Payment`, // Redirect after verification
            handleCodeInApp: true,
        };
        const verificationLink = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

        // **Send email using Nodemailer**
        const mailOptions = {
            from: "jericodcosta95375788@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html: `
                <h2>Welcome to Your App</h2>
                <p>Click the link below to verify your email:</p>
                <a href="${verificationLink}" style="padding: 10px; background: blue; color: white; text-decoration: none;">Verify Email</a>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Verification email sent!" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
        // sdfsdf
    }
}
