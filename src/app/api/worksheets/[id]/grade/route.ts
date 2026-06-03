// src/app/api/worksheets/[id]/grade/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { score, incorrectQuestions } = body;

    if (score === undefined || score === null) {
      return NextResponse.json({ error: "Missing score parameter" }, { status: 400 });
    }

    // 1. Fetch the generated worksheet
    const worksheet = await prisma.generatedWorksheet.findUnique({
      where: { id }
    });

    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    // 2. Parse and update attempts history
    let attempts = [];
    if (worksheet.attemptsJson) {
      try {
        attempts = JSON.parse(worksheet.attemptsJson);
      } catch (e) {
        console.error("Failed to parse attempts history:", e);
      }
    }
    attempts.push({
      score: Number(score),
      date: new Date()
    });

    const updatedWorksheet = await prisma.generatedWorksheet.update({
      where: { id },
      data: { 
        score: Number(score),
        attemptsJson: JSON.stringify(attempts)
      }
    });

    // 3. If registered profile, update the WeaknessLog
    if (worksheet.studentProfileId && incorrectQuestions && Array.isArray(incorrectQuestions)) {
      const studentProfileId = worksheet.studentProfileId;
      const subject = worksheet.subject;
      const topic = worksheet.topic;

      for (const question of incorrectQuestions) {
        const { subtopic } = question;
        if (!subtopic) continue;

        // Upsert weakness log: increment errorCount on hit, or create new log
        await prisma.weaknessLog.upsert({
          where: {
            id: await findWeaknessLogId(studentProfileId, subject, topic, subtopic) || "non-existent-uuid"
          },
          update: {
            errorCount: { increment: 1 },
            lastTestedAt: new Date()
          },
          create: {
            studentProfileId,
            subject,
            topic,
            subtopic,
            errorCount: 1,
            successCount: 0,
            lastTestedAt: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      status: "success",
      worksheetId: updatedWorksheet.id,
      score: updatedWorksheet.score
    });

  } catch (error) {
    console.error("[Grade API Error] Failed to update worksheet grade:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}

// Helper function to lookup log record ID since we use standard SQLite fields
async function findWeaknessLogId(
  studentProfileId: string,
  subject: string,
  topic: string,
  subtopic: string
): Promise<string | null> {
  const log = await prisma.weaknessLog.findFirst({
    where: {
      studentProfileId,
      subject,
      topic,
      subtopic
    },
    select: { id: true }
  });
  return log ? log.id : null;
}
