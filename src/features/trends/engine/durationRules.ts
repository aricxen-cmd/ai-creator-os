export interface DurationRule {
  scenes: number;

  secondsPerScene?: number;

  pairs?: number;

  images?: number;
}

const brainrotRules: Record<
  string,
  DurationRule
> = {
  "35s": {
    scenes: 7,
    secondsPerScene: 5,
  },

  "45s": {
    scenes: 9,
    secondsPerScene: 5,
  },

  "65s": {
    scenes: 13,
    secondsPerScene: 5,
  },
};

const clayRules: Record<
  string,
  DurationRule
> = {
  "42s": {
    scenes: 7,
    secondsPerScene: 6,
  },

  "54s": {
    scenes: 9,
    secondsPerScene: 6,
  },

  "60s": {
    scenes: 10,
    secondsPerScene: 6,
  },
};

const animalHaircutRules: Record<
  string,
  DurationRule
> = {
  "10s": {
    scenes: 1,
    pairs: 1,
    images: 2,
  },

  "20s": {
    scenes: 2,
    pairs: 2,
    images: 4,
  },
};

const anatomyFitnessRules: Record<
  string,
  DurationRule
> = {
  "15s": {
    scenes: 3,
    pairs: 3,
    images: 6,
  },

  "20s": {
    scenes: 4,
    pairs: 4,
    images: 8,
  },

  "25s": {
    scenes: 5,
    pairs: 5,
    images: 10,
  },

  "30s": {
    scenes: 6,
    pairs: 6,
    images: 12,
  },

  "35s": {
    scenes: 7,
    pairs: 7,
    images: 14,
  },

  "40s": {
    scenes: 8,
    pairs: 8,
    images: 16,
  },

  "45s": {
    scenes: 9,
    pairs: 9,
    images: 18,
  },

  "65s": {
    scenes: 13,
    pairs: 13,
    images: 26,
  },
};

const carEvolutionRules: Record<
  string,
  DurationRule
> = {
  "20s": {
    scenes: 2,
    pairs: 2,
    images: 4,
  },

  "30s": {
    scenes: 3,
    pairs: 3,
    images: 6,
  },

  "40s": {
    scenes: 4,
    pairs: 4,
    images: 8,
  },

  "60s": {
    scenes: 6,
    pairs: 6,
    images: 12,
  },
};

export function getDurationRule(
  formatId: string,
  duration: string
): DurationRule | null {
  switch (formatId) {
    case "brainrot":
      return (
        brainrotRules[
          duration
        ] ?? null
      );

    case "clay-story":
      return (
        clayRules[
          duration
        ] ?? null
      );

    case "animal-haircut":
      return (
        animalHaircutRules[
          duration
        ] ?? null
      );

    case "anatomy-fitness":
      return (
        anatomyFitnessRules[
          duration
        ] ?? null
      );

    case "car-evolution":
      return (
        carEvolutionRules[
          duration
        ] ?? null
      );

    default:
      return null;
  }
}