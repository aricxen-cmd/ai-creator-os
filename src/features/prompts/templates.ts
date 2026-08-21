export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  styleLock: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "cinematic-realism",
    name: "Cinematic Realism",
    description:
      "Photorealistic cinematic production style.",
    styleLock: `
Photorealistic cinematic realism.

Use physically believable lighting, realistic materials,
natural skin and fabric textures, cinematic depth of field,
professional composition, and consistent color grading.

Avoid cartoonish proportions, plastic-looking surfaces,
oversharpening, text, logos, watermarks, and visual artifacts.
`.trim(),
  },

  {
    id: "premium-claymation",
    name: "Premium Claymation",
    description:
      "Premium stop-motion clay animation.",
    styleLock: `
Premium stop-motion claymation.

Everything should appear physically sculpted from high-quality clay.

Use visible handmade texture, subtle fingerprints,
soft studio lighting, miniature practical sets,
cinematic stop-motion composition,
and believable clay deformation.

Maintain identical character proportions,
clothing colors, facial construction,
and material appearance across every scene.

Avoid photoreal human skin, flat digital illustration,
cheap plastic appearance, text, logos, and watermarks.
`.trim(),
  },

  {
    id: "2d-animation",
    name: "2D Animation",
    description:
      "Clean high-quality animated short-form style.",
    styleLock: `
Professional 2D animated short-form visual style.

Use clean shapes, expressive characters,
clear silhouettes, readable poses,
consistent line weight,
controlled shading,
and polished animation-ready character design.

Maintain identical character proportions,
face design, clothing, colors,
and visual language across every scene.

Avoid photorealism, inconsistent anatomy,
text, logos, and watermarks.
`.trim(),
  },

  {
    id: "3d-animation",
    name: "3D Animation",
    description:
      "Polished stylized 3D animated production.",
    styleLock: `
Premium stylized 3D animation.

Use polished character models,
soft physically based materials,
cinematic lighting,
clean geometry,
expressive facial animation,
and professional feature-animation composition.

Maintain consistent character models,
proportions, clothing, colors,
hair, facial structure,
and material appearance.

Avoid character redesigns between scenes,
text, logos, watermarks,
and low-quality game-render appearance.
`.trim(),
  },
];