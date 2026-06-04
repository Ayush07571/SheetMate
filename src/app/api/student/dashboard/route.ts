// src/app/api/student/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get("id");

    if (!profileId) {
      return NextResponse.json({ error: "Missing student profile ID" }, { status: 400 });
    }

    // 1. Fetch student details
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch history of generated sheets
    const worksheets = await prisma.generatedWorksheet.findMany({
      where: { studentProfileId: profileId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        subject: true,
        topic: true,
        difficulty: true,
        score: true,
        totalMarks: true,
        attemptsJson: true,
        createdAt: true
      }
    });

    // 3. Fetch all weakness and progress logs
    const weaknesses = await prisma.weaknessLog.findMany({
      where: {
        studentProfileId: profileId
      },
      orderBy: [
        { errorCount: "desc" },
        { successCount: "desc" }
      ]
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        name: profile.name,
        grade: profile.grade,
        board: profile.board,
        parentPin: profile.parentPin,
        parentEmail: profile.parentEmail,
        parentPhone: profile.parentPhone,
        studentPhone: profile.studentPhone,
        password: profile.password
      },
      worksheets,
      weaknesses
    });

  } catch (error) {
    console.error("[Dashboard API Error] Failed to compile dashboard data:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
