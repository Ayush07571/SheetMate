// src/app/api/student/profiles/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Fetch all active profiles to display on the Sign-In selector screen
    const profiles = await prisma.studentProfile.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        grade: true,
        board: true
      }
    });

    return NextResponse.json(profiles);

  } catch (error) {
    console.error("[Get Profiles API Error] Failed to retrieve profiles list:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
