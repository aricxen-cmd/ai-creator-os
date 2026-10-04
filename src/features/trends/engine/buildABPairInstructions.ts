import type {
  SceneContract,
} from "./sceneContracts";

export function buildABPairInstructions(
  contract: SceneContract
) {
  if (
    contract.mode !==
      "a-b-pairs"
  ) {
    return "";
  }

  const pairs =
    contract.expectedPairs ??
    contract.expectedScenes;

  const images =
    contract.expectedImages ??
    pairs * 2;

  return `
A/B TRANSITION REQUIREMENTS

This format uses paired image states.

EXPECTED PAIRS:
${pairs}

EXPECTED IMAGES:
${images}

For every scene create two visual states:

IMAGE A
The exact starting state of the scene.

IMAGE B
The exact ending state of the same scene.

Both images must preserve:

- same subject identity
- same character face
- same body proportions
- same wardrobe where applicable
- same camera direction unless the contract explicitly requires otherwise
- same location geometry
- same key props

Image B must clearly show the result of the action begun in Image A.

Do not treat A and B as unrelated scenes.

Each A/B pair represents ONE production scene.
`.trim();
}