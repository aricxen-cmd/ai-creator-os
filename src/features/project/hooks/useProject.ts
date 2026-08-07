import { useProjectContext } from "../context/ProjectContext";

export function useProject() {
  return useProjectContext();
}