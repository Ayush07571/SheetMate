// src/app/worksheets/[id]/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThreeBackground from "@/components/ThreeBackground";

interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  answer: string;
  subtopic?: string;
  solutionExplanation?: string;
}

interface Section {
  name: string;
  questions: Question[];
}

interface MatchingItem {
  left: string;
  right: string;
}

interface BlankQuestion {
  id: number;
  sentence: string;
  answer: string;
}

interface OddOutQuestion {
  id: number;
  words: string[];
  answer: string;
  explanation: string;
}

interface Activity {
  type: "MATCHING" | "FILL_BLANKS" | "ODD_OUT";
  instruction: string;
  items?: MatchingItem[];
  wordBank?: string[];
  questions?: BlankQuestion[] | OddOutQuestion[];
}

interface WorksheetData {
  title: string;
  board?: string;
  grade: string;
  subject: string;
  sections?: Section[];
  activities?: Activity[];
}

export default function WorksheetPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [worksheet, setWorksheet] = useState<any | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [answerKeyIncluded, setAnswerKeyIncluded] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleToggleSolutions = () => {
    if (!worksheet?.studentProfileId) {
      setShowUpgradeModal(true);
    } else {
      setShowSolutions(!showSolutions);
    }
  };

  useEffect(() => {
    async function loadWorksheet() {
      try {
        const res = await fetch(`/api/worksheets/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to load worksheet");
        }
        const data = await res.json();
        setWorksheet(data);
        // Respect the includeAnswerKey flag set at generation time
        const keyIncluded = data?.data?.includeAnswerKey !== false;
        setAnswerKeyIncluded(keyIncluded);
        setShowSolutions(keyIncluded); // Default: show if included, hide if not
      } catch (err) {
        setError((err as Error).message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    loadWorksheet();
  }, [id]);

  const handlePrintWorksheet = () => {
    const prevShow = showSolutions;
    setShowSolutions(false);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setShowSolutions(prevShow);
      }, 500);
    }, 150);
  };

  const handlePrintSolutions = () => {
    if (!worksheet?.studentProfileId) return;
    setShowSolutions(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)" }}>Loading generated worksheet...</p>
      </div>
    );
  }

  if (error && !worksheet) {
    return (
      <div style={{ maxWidth: "600px", margin: "100px auto", textAlign: "center", padding: "20px" }}>
        <h2 style={{ color: "#ef4444", marginBottom: "16px" }}>Error</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>{error}</p>
        <button type="button" className="btn-primary" onClick={() => router.push("/")}>Back to Home</button>
      </div>
    );
  }

  const { data }: { data: WorksheetData } = worksheet;
  const isEarlyLearner = ["LKG", "UKG", "Class 1", "Class 2"].includes(data.grade);

  return (
    <main style={{ minHeight: "100vh", padding: "20px" }}>
      <ThreeBackground />

      {/* Screen Interface Headers */}
      <div className="no-print" style={{ maxWidth: "800px", margin: "0 auto 30px auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <button type="button" className="btn-secondary" onClick={() => router.push("/")} style={{ padding: "10px 20px" }}>
          &larr; Practice Again
        </button>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleToggleSolutions} 
            style={{ padding: "10px 20px", borderColor: showSolutions ? "var(--accent-cyan)" : "var(--border-glow)", color: showSolutions ? "var(--accent-cyan)" : "var(--text-secondary)" }}
          >
            {showSolutions ? "Hide Answer Key" : "Show Answer Key"}
            {!answerKeyIncluded && <span style={{ fontSize: "0.7rem", marginLeft: "6px", color: "#fca5a5" }}>(Not included)</span>}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handlePrintWorksheet}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #0284c7, #06b6d4)",
              border: "none",
              display: "flex", alignItems: "center", gap: "8px"
            }}
          >
            <span>⬇</span>
            <span>Download Worksheet PDF</span>
          </button>
          {worksheet?.studentProfileId ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handlePrintSolutions}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #059669, #10b981)",
                border: "none",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <span>⬇</span>
              <span>Download Solutions PDF</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowUpgradeModal(true)}
              style={{
                padding: "10px 20px",
                borderColor: "rgba(167, 139, 250, 0.4)",
                color: "#a78bfa",
                display: "flex", alignItems: "center", gap: "8px"
              }}
            >
              <span>🔒</span>
              <span>Download Solutions PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Print Layout Wrapper */}
      <div className="print-container" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Left Side: A4 Page Viewer */}
        <div className="printable-sheet" style={{ background: "#fff", color: "#000", padding: "40px", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          
          {/* A4 Sheet Header */}
          <div style={{ borderBottom: "3px solid #000", paddingBottom: "16px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", background: "#000", color: "#fff", padding: "4px 10px", borderRadius: "4px" }}>
                {data.board || "HOME PRACTICE"}
              </span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                {data.grade}
              </span>
            </div>
            <h1 style={{ fontSize: "1.6rem", marginTop: "12px", color: "#000" }}>{data.title}</h1>
            <p style={{ fontSize: "0.95rem", color: "#475569", marginTop: "4px", fontWeight: 600 }}>
              Subject: {data.subject} &bull; Difficulty: {worksheet.difficulty}
            </p>
            
            {/* Blanks for Student Details */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", fontSize: "0.85rem", borderTop: "1px solid #e2e8f0", paddingTop: "12px" }}>
              <span>Student Name: ________________________________</span>
              <span>Date: ________________</span>
              <span style={{ border: "2px solid #000", padding: "4px 12px", fontWeight: 700, borderRadius: "4px" }}>
                Score: {worksheet.score !== null ? `${worksheet.score} / ${worksheet.totalMarks}` : "   / " + worksheet.totalMarks}
              </span>
            </div>
          </div>

          {/* Worksheet Questions */}
          <div style={{ minHeight: "400px" }}>
            {isEarlyLearner ? (
              // Early Learners Activity Layout
              data.activities?.map((act, idx) => (
                <div key={idx} className="question-block" style={{ marginBottom: "30px" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "10px", color: "#000" }}>
                    Activity {idx + 1}: {act.instruction}
                  </h3>
                  
                  {/* Matching Activity */}
                  {act.type === "MATCHING" && act.items && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 40px", fontSize: "0.95rem" }}>
                      <div>
                        {act.items.map((item, i) => (
                          <div key={i} style={{ margin: "10px 0" }}>{i + 1}. {item.left}</div>
                        ))}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {act.items.map((item, i) => (
                          <div key={i} style={{ margin: "10px 0" }}>&bull; {item.right}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fill in the Blanks Activity */}
                  {act.type === "FILL_BLANKS" && act.questions && (
                    <div style={{ fontSize: "0.95rem", paddingLeft: "10px" }}>
                      {act.wordBank && (
                        <div style={{ border: "1.5px dashed #000", padding: "10px", borderRadius: "6px", textAlign: "center", marginBottom: "16px", fontWeight: 600 }}>
                          Word Box: [ {act.wordBank.join(", ")} ]
                        </div>
                      )}
                      {(act.questions as BlankQuestion[]).map((q, i) => (
                        <div key={i} style={{ margin: "14px 0" }}>
                          {i + 1}. {q.sentence}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Odd One Out Activity */}
                  {act.type === "ODD_OUT" && act.questions && (
                    <div style={{ fontSize: "0.95rem", paddingLeft: "10px" }}>
                      {(act.questions as OddOutQuestion[]).map((q, i) => (
                        <div key={i} style={{ margin: "14px 0" }}>
                          {i + 1}. Row: &nbsp;<strong>[ {q.words.join(", ")} ]</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              // Standard Middle School Exam Layout
              data.sections?.map((section, idx) => (
                <div key={idx} style={{ marginBottom: "32px" }}>
                  <h2 style={{ fontSize: "1.15rem", borderBottom: "2px solid #000", paddingBottom: "4px", marginBottom: "14px", color: "#4f46e5" }}>
                    {section.name}
                  </h2>
                  {section.questions.map((q, qIdx) => (
                    <div key={q.id} className="question-block" style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
                      <p style={{ fontWeight: 600, color: "#000" }}>
                        Q{qIdx + 1 + (idx === 1 ? 5 : idx === 2 ? 8 : 0)}: {q.text}
                      </p>
                      
                      {q.type === "MCQ" && q.options && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", paddingLeft: "14px", marginTop: "8px" }}>
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx}>
                              {String.fromCharCode(97 + oIdx)}) {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type === "SHORT" && (
                        <div style={{ height: "40px", borderBottom: "1px dashed #cbd5e1", marginTop: "10px" }}></div>
                      )}

                      {q.type === "LONG" && (
                        <div style={{ marginTop: "10px" }}>
                          <div style={{ height: "24px", borderBottom: "1px dashed #cbd5e1" }}></div>
                          <div style={{ height: "24px", borderBottom: "1px dashed #cbd5e1", marginTop: "6px" }}></div>
                          <div style={{ height: "24px", borderBottom: "1px dashed #cbd5e1", marginTop: "6px" }}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer watermark */}
          <div style={{ borderTop: "2px solid #000", paddingTop: "12px", marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#475569" }}>
            <span>Generated for free on <strong>sheetmate.in</strong></span>
            <span>Study regular, score high!</span>
          </div>

          {/* PRINT-ONLY PAGE BREAK FOR THE ANSWER KEY */}
          {showSolutions && (
            <div className="print-only-answer-key">
              <div style={{ borderBottom: "3px solid #000", paddingBottom: "16px", marginBottom: "24px", marginTop: "40px" }}>
                <h1 style={{ fontSize: "1.6rem", color: "#000" }}>Answer Key & Solutions</h1>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>Parent reference manual for worksheet validation.</p>
              </div>
              
              {isEarlyLearner ? (
                data.activities?.map((act, idx) => (
                  <div key={idx} style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
                    <h3 style={{ fontWeight: 700, color: "#000" }}>Activity {idx + 1} Answers:</h3>
                    {act.type === "MATCHING" && act.items && (
                      <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
                        {act.items.map((item, i) => (
                          <li key={i}>{item.left} &rarr; <strong>{item.right}</strong></li>
                        ))}
                      </ul>
                    )}
                    {act.type === "FILL_BLANKS" && act.questions && (
                      <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
                        {(act.questions as BlankQuestion[]).map((q, i) => (
                          <li key={i}>Sentence {i + 1}: <strong>{q.answer}</strong></li>
                        ))}
                      </ul>
                    )}
                    {act.type === "ODD_OUT" && act.questions && (
                      <ul style={{ paddingLeft: "20px", marginTop: "6px" }}>
                        {(act.questions as OddOutQuestion[]).map((q, i) => (
                          <li key={i}>Row {i + 1}: Odd word is <strong>{q.answer}</strong> ({q.explanation})</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                data.sections?.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", borderBottom: "1.5px solid #000", paddingBottom: "4px", marginBottom: "10px", color: "#000" }}>
                      Answers: {section.name}
                    </h3>
                    {section.questions.map((q, qIdx) => (
                      <div key={q.id} style={{ marginBottom: "14px", fontSize: "0.9rem" }}>
                        <p style={{ fontWeight: 700, color: "#000" }}>
                          Q{qIdx + 1 + (idx === 1 ? 5 : idx === 2 ? 8 : 0)}: Correct Answer: {q.answer}
                        </p>
                        <p style={{ color: "#475569", fontStyle: "italic", marginTop: "2px" }}>
                          Solution Guide: {q.solutionExplanation}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic inline styles to hide interface elements on printing */}
      <style jsx global>{`
        @media print {
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .no-print, #particles-bg {
            display: none !important;
          }
          .print-container {
            display: block !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .printable-sheet {
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            border-radius: 0 !important;
          }
          .print-only-answer-key {
            display: block !important;
            page-break-before: always !important;
          }
          .question-block {
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100 }}>
          <div className="glass-card" style={{ padding: "30px", width: "100%", maxWidth: "450px", margin: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
            <h3 style={{ fontSize: "1.3rem", color: "var(--accent-purple)", marginBottom: "10px", fontFamily: "var(--font-heading)" }}>
              Unlock Answer Keys & Pro Features
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "20px", lineHeight: 1.5 }}>
              Viewing correct answer keys, solutions explanations, and printing solved worksheets are Pro features.
            </p>
            <div style={{
              background: "rgba(124, 58, 237, 0.08)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "24px",
              fontSize: "0.8rem",
              color: "#a78bfa"
            }}>
              🎉 <strong>Beta Offer:</strong> Create a student profile today and get lifetime Pro access for <strong>100% FREE</strong> (Normal price: ₹800/mo).
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => setShowUpgradeModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1 }} 
                onClick={() => router.push("/dashboard?mode=signup")}
              >
                Get Pro for Free
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
