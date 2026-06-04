import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, password } = body;

    if (!profileId) {
      return NextResponse.json({ error: "Missing student profile ID" }, { status: 400 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Direct comparison for MVP parity with parentPin
    if (profile.password !== password) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    return NextResponse.json({
      status: "success",
      profileId: profile.id,
      name: profile.name,
      grade: profile.grade,
      board: profile.board
    });

  } catch (error) {
    console.error("[Login API Error] Failed to authenticate student profile:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
