import type { ToySubmission } from "@/types/database";

export function catalogDifficultyLabel(d: ToySubmission["difficulty"]): string {
  switch (d) {
    case "beginner":
      return "Easy";
    case "intermediate":
      return "Intermediate";
    case "advanced":
    default:
      return "Difficult";
  }
}
