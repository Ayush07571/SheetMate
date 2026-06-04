// src/app/api/parent/otp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parentPhone } = body;

    if (!parentPhone) {
      return NextResponse.json({ error: "Parent mobile number is required" }, { status: 400 });
    }

    // Generate simulated 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

    return NextResponse.json({
      status: "success",
      otp: generatedOtp,
      message: `[Simulated Notification] Sent verification code ${generatedOtp} to parent mobile number ${parentPhone}`
    });

  } catch (error) {
    console.error("[Parent OTP API Error] Failed to generate OTP:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
