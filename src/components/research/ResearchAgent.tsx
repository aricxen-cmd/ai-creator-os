"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ResearchAgent() {
  const [topic, setTopic] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateResearch() {
    if (!topic.trim()) return;

    setLoading(true);

    // Placeholder until AI quota is available
    setTimeout(() => {
      setReport(`# Research Report

## Topic
${topic}

## Executive Summary
This is where the AI-generated research will appear.

## Timeline

## Key Facts

## Important People

## Opportunities

## Risks

## Suggested Video Angles

## SEO Keywords
`);

      setLoading(false);
    }, 500);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold">Research Agent</h1>

      <input
        className="mt-6 w-full rounded-lg border p-3"
        placeholder="Enter a topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <Button
        className="mt-4"
        onClick={generateResearch}
        disabled={loading}
      >
        {loading ? "Researching..." : "Generate Research"}
      </Button>

      <div className="mt-8 rounded-lg border p-6">
        <pre className="whitespace-pre-wrap">
          {report}
        </pre>
      </div>
    </div>
  );
}