// src/app/api/student/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, grade, board, parentPin, parentEmail, parentPhone, studentPhone, password } = body;

    if (!name || !grade || !board) {
      return NextResponse.json({ error: "Missing name, grade, or board" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) {
      return NextResponse.json({ error: "Password must contain both letters and numbers" }, { status: 400 });
    }

    // Find or create a default global user to hold profiles in MVP
    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: "user@sheetmate.in",
          passwordHash: "default-placeholder-hash"
        }
      });
    }

    // Create the student profile linked to this user
    const profile = await prisma.studentProfile.create({
      data: {
        userId: defaultUser.id,
        name,
        grade,
        board,
        parentPin: parentPin || "0000",
        parentEmail: parentEmail || null,
        parentPhone: parentPhone || null,
        studentPhone: studentPhone || null,
        password: password || ""
      }
    });

    return NextResponse.json({
      status: "success",
      profileId: profile.id,
      name: profile.name,
      grade: profile.grade,
      board: profile.board,
      parentEmail: profile.parentEmail,
      parentPhone: profile.parentPhone,
      studentPhone: profile.studentPhone
    });

  } catch (error) {
    console.error("[Create Profile API Error] Failed to create student profile:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, grade, board, parentPin, parentEmail, parentPhone, studentPhone, password } = body;

    if (!id || !name || !grade || !board) {
      return NextResponse.json({ error: "Missing profile ID, name, grade, or board" }, { status: 400 });
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
      }
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!hasLetter || !hasNumber) {
        return NextResponse.json({ error: "Password must contain both letters and numbers" }, { status: 400 });
      }
    }

    const existingProfile = await prisma.studentProfile.findUnique({
      where: { id }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { id },
      data: {
        name,
        grade,
        board,
        parentPin: parentPin || existingProfile.parentPin,
        parentEmail: parentEmail !== undefined ? parentEmail : existingProfile.parentEmail,
        parentPhone: parentPhone !== undefined ? parentPhone : existingProfile.parentPhone,
        studentPhone: studentPhone !== undefined ? studentPhone : existingProfile.studentPhone,
        password: password !== undefined ? password : existingProfile.password
      }
    });

    return NextResponse.json({
      status: "success",
      profileId: updatedProfile.id,
      name: updatedProfile.name,
      grade: updatedProfile.grade,
      board: updatedProfile.board,
      studentPhone: updatedProfile.studentPhone
    });

  } catch (error) {
    console.error("[Update Profile API Error] Failed to update student profile:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}

