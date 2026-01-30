import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/utils/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, gender, dateOfBirth } = body;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    // Format phone number
    let formattedPhone = phone.replace(/\s/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+92" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("+92")) {
      formattedPhone = "+92" + formattedPhone;
    }

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      $or: [{ phone: formattedPhone }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this phone or email already exists" },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = {
      fullName,
      email,
      phone: formattedPhone,
      gender: gender || null,
      dateOfBirth: dateOfBirth || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        userId: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
