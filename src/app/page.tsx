// src/app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThreeBackground from "@/components/ThreeBackground";
import PreviewPaper from "@/components/PreviewPaper";
import GeneratorWizard from "@/components/GeneratorWizard";
import ChatAgent from "@/components/ChatAgent";

export default function HomePage() {
  const router = useRouter();
  const [studentProfileId, setStudentProfileId] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<any | null>(null);

  // Sync profile ID on load
  useEffect(() => {
    const savedId = localStorage.getItem("sheetmate_profile_id");
    if (savedId) {
      setStudentProfileId(savedId);
      fetch(`/api/student/dashboard?id=${savedId}`)
        .then(res => {
          if (res.ok) return res.json();
        })
        .then(data => {
          if (data && data.profile) {
            setStudentProfile(data.profile);
          }
        })
        .catch(err => console.error("Error loading profile:", err));
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("sheetmate_profile_id");
    setStudentProfileId(null);
    router.refresh();
  };
  
  // Selection states synced from the Wizard to the Preview paper
  const [selections, setSelections] = useState({
    board: "CBSE",
    grade: "Class 6",
    subject: "SCIENCE",
    topicNames: ["Select Chapters"] as string[],
    difficulty: "MEDIUM"
  });

  const handleSelectionChange = (newSelections: typeof selections) => {
    setSelections(newSelections);
  };

  const handleGenerationSuccess = (worksheetId: string) => {
    // Route to the print-preview & grader workspace for this worksheet
    router.push(`/worksheets/${worksheetId}`);
  };

  return (
    <main style={{ minHeight: "100vh", position: "relative", padding: "20px" }}>
      {/* 3D WebGL Floating Background */}
      <ThreeBackground />

      {/* Navigation bar header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto 40px auto",
          padding: "20px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => router.push("/")}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
              borderRadius: "8px"
            }}
          />
          <h2 style={{ fontSize: "1.4rem", fontFamily: "var(--font-heading)" }}>
            Sheet<span style={{ color: "var(--accent-purple)" }}>Mate</span>
          </h2>
        </div>
        <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span
            style={{ color: "var(--text-secondary)", fontSize: "0.9rem", cursor: "pointer" }}
            onClick={() => {
              const el = document.getElementById("features-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </span>
          {studentProfileId ? (
            <>
              <span 
                style={{ color: "var(--text-secondary)", fontSize: "0.9rem", cursor: "pointer", fontWeight: 600 }}
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "8px 18px", fontSize: "0.85rem", borderColor: "rgba(239, 68, 68, 0.4)", color: "#fca5a5" }}
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem", cursor: "pointer" }}>Curriculum</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
                onClick={() => router.push("/dashboard")}
              >
                Student Log In
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Main Hero grid layout */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "40px",
          alignItems: "center",
          paddingBottom: "80px"
        }}
      >
        {/* On desktop, switch to a 2-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "50px",
            alignItems: "center"
          }}
        >
          {/* Column 1: Info and Wizard */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#a78bfa",
                  background: "rgba(124, 58, 237, 0.12)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: "1px solid rgba(124, 58, 237, 0.2)"
                }}
              >
                AI-Powered School Practice
              </span>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  lineHeight: 1.1,
                  marginTop: "16px",
                  marginBottom: "16px"
                }}
                className="gradient-text"
              >
                Worksheets aligned to your child's exam pattern.
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "480px" }}>
                Generate customized worksheets aligned to CBSE syllabus in seconds (ICSE and State Boards coming soon). Enter scores to adapt future worksheets to their weak areas automatically.
              </p>
            </div>

            {/* Generator Wizard widget */}
            <GeneratorWizard
              studentProfileId={studentProfileId}
              onSelectionChange={handleSelectionChange}
              onGenerationSuccess={handleGenerationSuccess}
            />
          </div>

          {/* Column 2: Live interactive 3D paper mockup */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Interactive Live Preview
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Hover to tilt sheet &bull; Syncs with wizard selections
              </p>
            </div>
            <PreviewPaper
              board={selections.board}
              grade={selections.grade}
              subject={selections.subject}
              topicName={selections.topicNames.length > 1 ? `${selections.topicNames.length} Chapters` : (selections.topicNames[0] || "Select Chapters")}
              difficulty={selections.difficulty}
            />
          </div>
        </div>
      </section>

      {/* Core Features & Practice Loop Section */}
      <section
        id="features-section"
        style={{
          maxWidth: "1200px",
          margin: "0 auto 60px auto",
          padding: "0 20px",
          position: "relative"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--accent-purple)",
              background: "rgba(124, 58, 237, 0.12)",
              padding: "6px 12px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              border: "1px solid rgba(124, 58, 237, 0.2)"
            }}
          >
            How it works
          </span>
          <h2 className="gradient-text" style={{ fontSize: "2.1rem", marginTop: "12px", marginBottom: "12px" }}>
            The SheetMate Personalization Loop
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>
            Three core steps that build a tailored conceptual learning path for your child.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px"
          }}
        >
          {/* Feature 1 */}
          <div className="glass-card" style={{ padding: "30px", border: "1px solid rgba(255, 255, 255, 0.03)" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(124, 58, 237, 0.1)", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", border: "1px solid rgba(124, 58, 237, 0.3)" }}>
              <span style={{ color: "#a78bfa", fontWeight: "bold" }}>01</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>1. Curated AI Generation</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Worksheets align directly with CBSE syllabus across Grades LKG-Class 8 (with ICSE and State Boards coming soon). Generates high-quality exam structures and parent answer keys in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card" style={{ padding: "30px", border: "1px solid rgba(255, 255, 255, 0.03)" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(6, 182, 212, 0.1)", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
              <span style={{ color: "#22d3ee", fontWeight: "bold" }}>02</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>2. Parent Grader Workspace</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Unlock parent mode with a secure 4-digit PIN. Instead of scoring by hand, mark questions right or wrong on our interactive screen to immediately submit grading metrics.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card" style={{ padding: "30px", border: "1px solid rgba(124, 58, 237, 0.03)" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <span style={{ color: "#34d399", fontWeight: "bold" }}>03</span>
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>3. Weakness Target Weighting</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Our personalization engine tracks concept logs. Future sheets are automatically weighted to dedicate 60% of questions targeting topics they struggled with previously.
            </p>
          </div>
        </div>
      </section>

      {/* Guest vs. Profile Perks Comparison Section */}
      {!studentProfileId && (
        <section
          style={{
            maxWidth: "1200px",
            margin: "40px auto 80px auto",
            padding: "0 20px",
            position: "relative"
          }}
        >
          <div className="glass-card" style={{ padding: "40px 30px", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--accent-cyan)",
                  background: "rgba(6, 182, 212, 0.12)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: "1px solid rgba(6, 182, 212, 0.2)"
                }}
              >
                Why create a profile?
              </span>
              <h2 className="gradient-text" style={{ fontSize: "2rem", marginTop: "12px", marginBottom: "12px" }}>
                Unlock Adaptive Learning & Custom Reports
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>
                Registered profiles enable personalization that adapts worksheets to your child's specific weaknesses.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px",
                marginBottom: "40px"
              }}
            >
              {/* Guest Practice Perks */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.01)",
                  border: "1px solid rgba(255, 255, 255, 0.03)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <h3 style={{ color: "var(--text-secondary)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-muted)" }}></span>
                  Guest Practice (No Login)
                </h3>
                
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✕</span>
                    <span><strong>Limited Practice:</strong> Max 4 worksheets per 24 hours (tracked by IP address).</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✕</span>
                    <span><strong>Generic Content:</strong> Worksheets do not adapt to mistakes.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✕</span>
                    <span><strong>No Analytics:</strong> Historical grades and weak topics are not logged.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✕</span>
                    <span><strong>Print Only:</strong> Grading must be done offline using the printed key.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "#ef4444" }}>✕</span>
                    <span><strong>Manual Configuration:</strong> Re-select grade and board on every generate run.</span>
                  </li>
                </ul>
              </div>

              {/* Registered Profile Perks */}
              <div
                style={{
                  background: "rgba(124, 58, 237, 0.03)",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <h3 style={{ color: "#a78bfa", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-purple)" }}></span>
                  Student Profile (Free during Beta)
                </h3>
                
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px", flexGrow: 1 }}>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                    <span><strong>Unlimited Practice:</strong> Generate infinite worksheets with no rate limits.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                    <span><strong>Adaptive Questions:</strong> 60% of new sheets target previous mistakes automatically.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                    <span><strong>Mistake Logs & Heatmap:</strong> Detailed breakdown of concept strengths and weaknesses.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                    <span><strong>Interactive Parent Grader:</strong> Mark questions correct/incorrect on-screen inside dashboard.</span>
                  </li>
                  <li style={{ display: "flex", gap: "10px", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                    <span style={{ color: "#10b981", fontWeight: "bold" }}>✓</span>
                    <span><strong>1-Click Workspace:</strong> Instantly prepopulates details. Quick practice cycles.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: "16px 36px" }}
                onClick={() => router.push("/dashboard?mode=signup")}
              >
                Create Free Profile (Beta)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* AI Help Agent Chatbot */}
      <ChatAgent />

      {/* Landing footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "40px 0",
          color: "var(--text-muted)",
          fontSize: "0.8rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        <p>&copy; {new Date().getFullYear()} SheetMate (sheetmate.in). All rights reserved. English-medium MVP v1.0.0.</p>
      </footer>
    </main>
  );
}



