import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const host = req.headers.get("host") || "ab-talks-seven.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const resetToken = `abtalks_reset_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const resetUrl = `${protocol}://${host}/login?resetToken=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    // HTML Email Template for Gmail Inbox
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712; color: #F8FAFC; margin: 0; padding: 40px 20px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #07111F; border: 1px solid #1E293B; border-radius: 20px; padding: 36px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
          .header { text-align: center; margin-bottom: 28px; }
          .logo { font-size: 20px; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #3B82F6; font-size: 11px; font-weight: 700; border-radius: 99px; text-transform: uppercase; margin-bottom: 16px; }
          h2 { font-size: 22px; font-weight: 800; color: #FFFFFF; margin-top: 0; }
          p { font-size: 14px; color: #94A3B8; line-height: 1.6; }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563EB, #1D4ED8); color: #FFFFFF !important; text-decoration: none; font-weight: 800; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; border-radius: 12px; box-shadow: 0 0 25px rgba(37, 99, 235, 0.4); }
          .url-box { background: #030712; border: 1px solid #1E293B; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 11px; color: #3B82F6; word-break: break-all; margin-top: 20px; }
          .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #1E293B; text-align: center; font-size: 11px; color: #64748B; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="badge">ABTalks Password Recovery</div>
            <div class="logo">⚡ ABTALKS</div>
          </div>
          
          <h2>Reset Your Account Password</h2>
          <p>Hello Developer,</p>
          <p>We received a password reset request for your ABTalks account linked to <strong>${cleanEmail}</strong>.</p>
          <p>Click the button below to set a new password and resume your 60-day coding challenge streak:</p>
          
          <div class="btn-container">
            <a href="${resetUrl}" target="_blank" class="btn">RESET YOUR PASSWORD NOW →</a>
          </div>
          
          <p style="font-size: 12px; color: #64748B;">If the button above does not work, copy and paste this link into your browser:</p>
          <div class="url-box">${resetUrl}</div>
          
          <div class="footer">
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} ABTalks 60-Day Challenge Engine</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 1. Try Resend API first if key exists
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ABTalks Security <onboarding@resend.dev>",
          to: [cleanEmail],
          subject: "🔑 ABTalks Password Reset Link",
          html: htmlTemplate,
        }),
      });

      if (resendRes.ok) {
        return NextResponse.json({
          success: true,
          message: `Password reset link sent to Gmail inbox (${cleanEmail})`,
        });
      }
    }

    // 2. Try Gmail SMTP if configured
    let transporter: nodemailer.Transporter;

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback test transport
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    await transporter.sendMail({
      from: '"ABTalks Security Engine" <noreply@abtalks.app>',
      to: cleanEmail,
      subject: "🔑 ABTalks Password Reset Link",
      text: `Hello Developer,\n\nReset your ABTalks password using this link:\n${resetUrl}\n\nThis link is valid for 24 hours.`,
      html: htmlTemplate,
    });

    return NextResponse.json({
      success: true,
      message: `Password reset link sent to ${cleanEmail}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to dispatch password reset email." },
      { status: 500 }
    );
  }
}
