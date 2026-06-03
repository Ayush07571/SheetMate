// src/app/api/chat/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { queryOpenRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, profile } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing or invalid messages history" }, { status: 400 });
    }

    let profileContext = "";
    if (profile && profile.name) {
      profileContext = `\nACTIVE STUDENT PROFILE CONTEXT:\n- Student Name: ${profile.name}\n- Grade: ${profile.grade}\n- School Board: ${profile.board.replace("_", " ")}\nUse these as defaults when resolving the worksheet details if the user does not specify otherwise. If the user explicitly asks for a different grade, subject, or board, respect their explicit text.`;
    }

    const systemPrompt = `You are a helpful, friendly AI worksheet generation assistant for SheetMate.${profileContext}
Your goal is to extract the following 5 parameters from the conversation history:
1. 'board': Must always be "CBSE". If the user explicitly requests another board like ICSE or a State Board, politely inform them in the clarifyingMessage that SheetMate currently only supports CBSE (with ICSE and State Boards coming soon), and then set board to "CBSE".
2. 'grade': Must be one of: LKG, UKG, Class 1, Class 2, Class 3, Class 4, Class 5, Class 6, Class 7, Class 8.
3. 'subject': Must be one of: MATH, SCIENCE, ENGLISH, EVS, HINDI, SST.
4. 'topic': The specific topic or chapter name (e.g. "Fractions", "Photosynthesis", "Prepositions", "Plants").
5. 'difficulty': Must be one of: EASY, MEDIUM, HARD. Default to MEDIUM if not specified.

IMPORTANT GUIDELINES:
- If key details like 'grade', 'subject', or 'topic' are missing, or if you want to clarify 'difficulty', prompt the user for them in a warm, concise manner.
- Do NOT populate the 'params' property if you are still asking a clarifying question in 'clarifyingMessage' (even if a field has a default value like 'MEDIUM' difficulty or 'CBSE' board). If a clarifying question is asked, 'params' MUST be null.
- Only return a non-null 'params' object when all details are fully resolved and you do not need to ask any more clarifying questions.
- Return ONLY a valid JSON object matching the schema below. Do not wrap the JSON in markdown code blocks or output any extra conversational text outside the JSON.

SCHEMA:
{
  "clarifyingMessage": "Friendly, short message to the user asking for missing info, or confirming generation if complete.",
  "params": {
    "board": "CBSE",
    "grade": "LKG" | "UKG" | "Class 1" | "Class 2" | "Class 3" | "Class 4" | "Class 5" | "Class 6" | "Class 7" | "Class 8",
    "subject": "MATH" | "SCIENCE" | "ENGLISH" | "EVS" | "HINDI" | "SST",
    "topic": "extracted topic string",
    "difficulty": "EASY" | "MEDIUM" | "HARD"
  } // Set to null if any clarifying question is asked in clarifyingMessage.
}`;

    // Format the conversation history for the AI prompt
    const formattedHistory = messages
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n");

    const prompt = `Here is the current conversation transcript:\n\n${formattedHistory}\n\nPlease analyze the transcript above and return the JSON object:`;

    const aiResult = await queryOpenRouter(prompt, systemPrompt);

    return NextResponse.json(aiResult);

  } catch (error) {
    console.error("[Chat Extract API Error] Failed to process message:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
