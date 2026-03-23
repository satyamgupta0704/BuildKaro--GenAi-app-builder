"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodePanelProps {
  code: string;
  isLoading: boolean;
}

export default function CodePanel({ code, isLoading }: CodePanelProps) {
  const [tab, setTab] = useState<"code" | "preview">("code");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strip import/export statements Gemini may add — React is already global in the iframe
  const cleanCode = code
    .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\n?/g, "")  // remove all import lines
    .replace(/export\s+default\s+function/g, "function")        // remove export default function
    .replace(/export\s+default\s+/g, "");                       // remove any other export default

  const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>
    body { background: #0f0f0f; color: #ededed; margin: 0; font-family: sans-serif; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Destructure all common hooks from global React
    // so both "useState(...)" and "React.useState(...)" styles work
    const { useState, useEffect, useRef, useCallback, useMemo, useReducer } = React;

    ${cleanCode}

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  <\/script>
</body>
</html>`;

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a2a] flex items-center justify-between">
        <div className="flex gap-1">
          {(["code", "preview"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-colors capitalize ${
                tab === t
                  ? "bg-[#2a2a2a] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t === "code" ? "⌨️ Code" : "👁 Preview"}
            </button>
          ))}
        </div>

        {code && (
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white border border-[#2a2a2a] hover:border-gray-500 px-3 py-1 rounded-md transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating code...
          </div>
        ) : !code ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-600 text-sm gap-2">
            <span className="text-4xl">🖥️</span>
            <p>Your generated code will appear here</p>
          </div>
        ) : tab === "code" ? (
          <div className="h-full overflow-auto">
            <SyntaxHighlighter
              language="jsx"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.25rem",
                background: "transparent",
                fontSize: "0.8rem",
                lineHeight: "1.6",
                height: "100%",
              }}
              showLineNumbers
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ) : (
          <iframe
            srcDoc={previewHtml}
            title="Live Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
}