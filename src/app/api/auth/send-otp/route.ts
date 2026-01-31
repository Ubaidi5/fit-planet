import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Validate phone format
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 },
      );
    }

    // In production, send real OTP via SMS
    // For now, hardcoded OTP: 123456
    console.log(`Hardcoded OTP for ${phone}: 123456`);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        // In development, return OTP for testing
        otp: process.env.NODE_ENV === "development" ? "123456" : undefined,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
