import OpenAI from "openai";

export const analyzeAndRecommend = async (prompt) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content: `
You are a professional AI movie recommendation engine.

Based on the user's request:

1. Extract structured filters.
2. Recommend 8 high-quality movie titles.

Return ONLY valid JSON.

Format:

{
  "recommended_titles": [],
  "genres": [],
  "actor": null,
  "director": null,
  "keywords": [],
  "year_from": null,
  "year_to": null,
  "mood": null,
  "franchise": null
}
`
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return JSON.parse(completion.choices[0].message.content);
};
