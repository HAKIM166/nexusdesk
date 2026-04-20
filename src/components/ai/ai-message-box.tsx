"use client";

import { useState } from "react";

export default function AIMessageBox() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt) return;

    setLoading(true);
    setResponse("");

    // mock AI response (دلوقتي fake)
    setTimeout(() => {
      setResponse(
        "Based on your data, you should focus on increasing client retention and improving project delivery speed."
      );
      setLoading(false);
    }, 1200);
  }

  return (
    <div className="panel p-6 space-y-4">
      <textarea
        placeholder="Ask AI anything about your business..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-28 input-base resize-none"
      />

      <button
        onClick={handleGenerate}
        className="btn-primary"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {response && (
        <div className="panel p-4 text-sm text-[var(--foreground-muted)]">
          {response}
        </div>
      )}
    </div>
  );
}