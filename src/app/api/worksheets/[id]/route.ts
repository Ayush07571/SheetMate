// src/app/api/worksheets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const worksheet = await prisma.generatedWorksheet.findUnique({
      where: { id }
    });

    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: worksheet.id,
      studentProfileId: worksheet.studentProfileId,
      subject: worksheet.subject,
      topic: worksheet.topic,
      difficulty: worksheet.difficulty,
      totalMarks: worksheet.totalMarks,
      score: worksheet.score,
      attemptsJson: worksheet.attemptsJson,
      createdAt: worksheet.createdAt,
      data: JSON.parse(worksheet.contentJson)
    });

  } catch (error) {
    console.error("[Get Worksheet API Error] Failed to fetch worksheet:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.generatedWorksheet.delete({
      where: { id }
    });

    return NextResponse.json({
      status: "success",
      message: "Worksheet deleted successfully"
    });

  } catch (error) {
    console.error("[Delete Worksheet API Error] Failed to delete worksheet:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}
