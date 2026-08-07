"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { ProjectState } from "../types";

interface ProjectContextValue {
  project: ProjectState | null;

  setProject: React.Dispatch<
    React.SetStateAction<ProjectState | null>
  >;
}

const ProjectContext =
  createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [project, setProject] =
    useState<ProjectState | null>(null);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "ProjectProvider is missing."
    );
  }

  return context;
}