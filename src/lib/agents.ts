import { Agent } from "@/types/agent";

export const agents: Agent[] = [
  {
    id: "research",
    name: "Research Agent",
    description: "Research any topic.",
    icon: "🔬",
    color: "emerald",
    route: "/research",
    enabled: true,
  },
  {
    id: "script",
    name: "Script Studio",
    description: "Generate scripts.",
    icon: "✍️",
    color: "blue",
    route: "/script",
    enabled: true,
  },
  {
    id: "storyboard",
    name: "Storyboard",
    description: "Create storyboards.",
    icon: "🎬",
    color: "purple",
    route: "/storyboard",
    enabled: false,
  },
  {
    id: "scene-prompts",
    name: "Scene Prompts",
    description: "Generate cinematic prompts.",
    icon: "🎥",
    color: "orange",
    route: "/scene-prompts",
    enabled: false,
  },
  {
    id: "thumbnail",
    name: "Thumbnail Lab",
    description: "Generate thumbnails.",
    icon: "🖼️",
    color: "pink",
    route: "/thumbnail",
    enabled: true,
  },
];