import { Trend } from "@/types/trend";

export const trends: Trend[] = [
  {
  slug: "artificial-intelligence",
  title: "Artificial Intelligence",
  description: "Everything happening in AI.",
  topics: [
    "OpenAI",
    "AI Agents",
    "Humanoid Robots",
    "NVIDIA",
    "Automation",
    "Robotics",
  ],

  researchPrompt:
    "Research the latest developments, companies, market trends, and major breakthroughs related to this topic.",

  scriptPrompt:
    "Create a YouTube documentary script with a strong hook, engaging storytelling, and actionable insights.",

  scenePrompt:
    "Generate cinematic scene prompts for every paragraph of the script.",

  thumbnailPrompt:
    "Generate a high-CTR YouTube thumbnail concept with bold focal points and minimal text."
},

  {
    slug: "finance",
    title: "Finance",
    description: "Money and investing.",
    topics: [
      "Stock Market",
      "Real Estate",
      "ETFs",
      "Passive Income",
      "Cryptocurrency",
      "Dividends",
    ],
  },

  {
    slug: "gaming",
    title: "Gaming",
    description: "Gaming news and releases.",
    topics: [
      "GTA 6",
      "Minecraft",
      "Fortnite",
      "Call of Duty",
      "Steam",
    ],
  },
];