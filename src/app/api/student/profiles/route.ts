// src/app/api/student/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const contact = searchParams.get("contact")?.trim();
    const password = searchParams.get("password") || "";

    if (!contact) {
      // Secure default: return an empty list if no query is provided
      return NextResponse.json([]);
    }

    // Fetch active profiles associated with the specific student mobile number and password
    const profiles = await prisma.studentProfile.findMany({
      where: {
        studentPhone: { equals: contact, mode: "insensitive" },
        password: password
      },
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

