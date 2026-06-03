// src/app/api/worksheets/[id]/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { queryOpenRouter } from "@/lib/openrouter";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Fetch worksheet details
    const worksheet = await prisma.generatedWorksheet.findUnique({
      where: { id }
    });

    if (!worksheet) {
      return NextResponse.json({ error: "Worksheet not found" }, { status: 404 });
    }

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded in form data" }, { status: 400 });
    }

    // 3. Extract text from PDF using pdf-parse
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";
    try {
      // Polyfill browser globals that are evaluated by pdf.js / pdf-parse
      if (typeof global !== "undefined") {
        // @ts-ignore
        if (!global.DOMMatrix) global.DOMMatrix = class {};
        // @ts-ignore
        if (!global.ImageData) global.ImageData = class {};
        // @ts-ignore
        if (!global.Path2D) global.Path2D = class {};
      }
      
      const parser = new PDFParse({ data: buffer });
      const parsedData = await parser.getText();
      extractedText = parsedData.text || "";
      await parser.destroy();
    } catch (pdfErr) {
      console.error("[PDF Parse Error] Failed to extract text:", pdfErr);
      return NextResponse.json({ error: "Failed to parse PDF document. Ensure it is a valid PDF." }, { status: 400 });
    }

    // Clean up extracted text
    extractedText = extractedText.trim();

    // 4. Load Worksheet structure
    const worksheetContent = JSON.parse(worksheet.contentJson);
    const gradeLevel = worksheetContent.grade || "Class 6";
    const isEarly = ["LKG", "UKG", "Class 1", "Class 2"].includes(gradeLevel);

    // 5. Structure prompt and query OpenRouter
    const systemPrompt = `You are SheetMate AI, an expert school workbook reviewer.
Your job is to grade a student's worksheet submission (extracted text from their PDF solution) against the original worksheet content and correct answer key.

Worksheet Subject: ${worksheet.subject}
Worksheet Topic: ${worksheet.topic}
Grade Level: ${gradeLevel}
Total Marks: ${worksheet.totalMarks}

ORIGINAL WORKSHEET DETAILS:
${JSON.stringify(worksheetContent, null, 2)}

STUDENT'S SUBMITTED TEXT (Extracted from PDF):
---
${extractedText || "[NO READABLE TEXT DETECTED IN PDF]"}
---

INSTRUCTIONS:
1. Carefully compare the student's submitted text to the correct answers of each question in the original worksheet.
2. The student's text might be messy, out of order, or contain spelling mistakes. Use intelligent matching to identify which answer corresponds to which question.
3. For each question, decide if the student's answer is CORRECT or INCORRECT. Be fair but accurate.
4. Calculate the total score out of the maximum marks (${worksheet.totalMarks}) based on the proportion of correct answers.
5. Provide a short feedback/explanation for each question, including what the student wrote and why it was marked correct or incorrect.
6. If the student's submitted text is completely blank, missing answers, or holds no relevant content, mark all questions as INCORRECT, set the score to 0, and note in the feedback: "No readable answers found. Please make sure to upload a text-readable PDF."
7. Return ONLY a valid JSON object matching the schema below. Do not wrap in markdown or add extra text.

SCHEMA:
{
  "score": number, // calculated score out of ${worksheet.totalMarks}
  "feedback": [
    {
      "questionId": "string", // The exact ID of the question (e.g. "q1", "q2", or for early learners "act_0_q_0", "act_0_q_1", etc.)
      "status": "CORRECT" | "INCORRECT",
      "studentAnswer": "what the student wrote, or 'Not found'",
      "feedback": "constructive short tip explaining correctness"
    }
  ]
}`;

    const prompt = `Grade this student submission against the answer key. Provide feedback for every question.`;
    
    let gradingResult;
    try {
      gradingResult = await queryOpenRouter(prompt, systemPrompt);
    } catch (aiErr) {
      console.error("[AI Review Error] OpenRouter request failed:", aiErr);
      return NextResponse.json({ error: "AI grading service is temporarily unavailable. Please try manual grading." }, { status: 502 });
    }

    const { score, feedback } = gradingResult;
    const computedScore = Math.max(0, Math.min(worksheet.totalMarks, Number(score || 0)));

    // 6. Parse Attempts and Update attempts history
    let attempts = [];
    if (worksheet.attemptsJson) {
      try {
        attempts = JSON.parse(worksheet.attemptsJson);
      } catch (e) {
        console.error("Failed to parse attempts history:", e);
      }
    }
    attempts.push({
      score: computedScore,
      date: new Date()
    });

    await prisma.generatedWorksheet.update({
      where: { id },
      data: {
        score: computedScore,
        attemptsJson: JSON.stringify(attempts)
      }
    });

    // 7. Log Weaknesses for Incorrect Answers (if student is registered)
    if (worksheet.studentProfileId && feedback && Array.isArray(feedback)) {
      const studentProfileId = worksheet.studentProfileId;
      const subject = worksheet.subject;
      const topic = worksheet.topic;

      for (const item of feedback) {
        if (item.status === "INCORRECT") {
          const subtopicName = getQuestionSubtopic(item.questionId, worksheetContent, topic, isEarly);
          
          await prisma.weaknessLog.upsert({
            where: {
              id: await findWeaknessLogId(studentProfileId, subject, topic, subtopicName) || "non-existent-uuid"
            },
            update: {
              errorCount: { increment: 1 },
              lastTestedAt: new Date()
            },
            create: {
              studentProfileId,
              subject,
              topic,
              subtopic: subtopicName,
              errorCount: 1,
              successCount: 0,
              lastTestedAt: new Date()
            }
          });
        }
      }
    }

    return NextResponse.json({
      status: "success",
      score: computedScore,
      feedback
    });

  } catch (error) {
    console.error("[Review API Error] Failed to grade PDF:", error);
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}

// Helper to determine question subtopic
function getQuestionSubtopic(questionId: string, worksheetContent: any, worksheetTopic: string, isEarly: boolean): string {
  if (isEarly) {
    const parts = questionId.split("_");
    const actIdx = parseInt(parts[1], 10);
    const act = worksheetContent.activities?.[actIdx];
    if (act) {
      const actTypeLabel = act.type === "MATCHING" ? "Matching" : act.type === "FILL_BLANKS" ? "Fill Blanks" : "Odd Out";
      return `${worksheetTopic} (${actTypeLabel})`;
    }
    return worksheetTopic;
  } else {
    const sections = worksheetContent.sections || [];
    for (const sec of sections) {
      const q = sec.questions?.find((quest: any) => quest.id === questionId);
      if (q) {
        return q.subtopic || worksheetTopic;
      }
    }
    return worksheetTopic;
  }
}

// Helper to lookup weakness record
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
