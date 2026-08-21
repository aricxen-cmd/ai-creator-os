export interface CastProfile {
  id: string;
  name: string;
  description: string;
}

export const defaultCastProfiles: CastProfile[] = [
  {
    id: "tariq",
    name: "Tariq",
    description: `
Young athletic male with medium tan skin.

Short black textured hair.
Strong jawline.
Thick dark eyebrows.
Expressive brown eyes.

Lean athletic build.

Clothing:
Gray hoodie.
Black joggers.
White sneakers.

Keep Tariq's face, hairstyle, body proportions, clothing, colors, age appearance, and overall character design identical in every scene.
`.trim(),
  },

  {
    id: "zain",
    name: "Zain",
    description: `
Young male with medium tan skin.

Short dark hair.
Defined facial structure.
Expressive dark brown eyes.

Athletic average build.

Keep Zain's face, hairstyle, proportions, clothing, colors, age appearance, and overall character design identical in every scene.
`.trim(),
  },
];