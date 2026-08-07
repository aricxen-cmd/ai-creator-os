export function buildStoryboardPrompt(script: string) {
  return `
You are a professional film director.

Convert the following script into VALID JSON.

Return ONLY valid JSON.

Format:

{
  "title":"Video Title",
  "scenes":[
    {
      "id":1,
      "narration":"",
      "visual":"",
      "camera":"",
      "motion":"",
      "duration":"",
      "transition":""
    }
  ]
}

Script:

${script}
`;
}