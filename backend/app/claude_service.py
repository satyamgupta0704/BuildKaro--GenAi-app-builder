import os
import google.generativeai as genai
from dotenv import load_dotenv
from app.schemas import Message

load_dotenv()

SYSTEM_PROMPT = """You are an expert React developer. When given a description of a UI or app, 
you respond ONLY with a single self-contained React component written in JSX.

Rules:
- Use only inline styles or Tailwind CSS classes (assume Tailwind is available)
- Do NOT import any external libraries or components
- The component must be a default export named App
- Keep the code clean, modern, and production-quality
- Use React hooks (useState, useEffect) where needed
- Do NOT include any explanation, markdown, or code fences — raw JSX code only
- Make the UI visually polished with a dark theme by default"""

MOCK_CODE = """export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#ededed", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#a855f7" }}>
        ⚡ Lovable Clone
      </h1>
      <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
        🟡 Mock mode — add your GEMINI_API_KEY to get real AI generation
      </p>
      <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: "16px", padding: "32px", textAlign: "center", minWidth: "280px" }}>
        <p style={{ marginBottom: "16px", color: "#9ca3af" }}>Sample counter component</p>
        <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "24px" }}>{count}</div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={() => setCount(c => c - 1)} style={{ padding: "8px 20px", background: "#374151", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1.2rem" }}>−</button>
          <button onClick={() => setCount(0)} style={{ padding: "8px 20px", background: "#1f2937", color: "#9ca3af", border: "1px solid #374151", borderRadius: "8px", cursor: "pointer" }}>Reset</button>
          <button onClick={() => setCount(c => c + 1)} style={{ padding: "8px 20px", background: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
        </div>
      </div>
    </div>
  );
}"""


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.mock_mode = not self.api_key or self.api_key == "your_api_key_here"

        if self.mock_mode:
            print("⚠️  GEMINI_API_KEY not set — running in MOCK MODE. UI is fully functional.")
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                system_instruction=SYSTEM_PROMPT,
            )
            print("✅ Gemini API key found — running in LIVE mode.")

    def generate_code(self, messages: list[Message]) -> str:
        """
        Send conversation history to Gemini and return generated JSX code.
        Falls back to mock response if no API key is configured.
        """
        if self.mock_mode:
            return MOCK_CODE

        # Gemini uses 'model' instead of 'assistant' for role
        history = [
            {
                "role": "user" if m.role == "user" else "model",
                "parts": [m.content],
            }
            for m in messages[:-1]  # all messages except the last
        ]

        chat = self.model.start_chat(history=history)
        response = chat.send_message(messages[-1].content)

        return response.text or ""


# Singleton instance — reused across requests
claude_service = GeminiService()
