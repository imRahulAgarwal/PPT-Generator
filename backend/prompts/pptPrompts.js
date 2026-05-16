// Prompt definitions for PPT slide generation
// Primary prompt: used with the main high-capability model
// Fallback prompt: stricter and more directive for smaller/less capable models

// Slide role rules:
//   Slide 1       — Welcome / Introduction slide
//   Slide 2 to N-1 — Core content slides
//   Slide N       — Thank You / Closing slide

const buildPrompt = (topic, grade, numberOfSlides) => `
You are an experienced school teacher creating a structured PowerPoint presentation for grade ${grade} students.

Task: Generate a complete PowerPoint presentation on the topic below.
Topic: "${topic}"
Total Slides: ${numberOfSlides}

Slide Structure Rules:
- Slide 1 must be a welcome/introduction slide that introduces the topic to the students.
- Slides 2 to ${numberOfSlides - 1} must cover the core content of the topic, each focusing on a distinct sub-concept.
- Slide ${numberOfSlides} must be a closing/thank-you slide that summarizes key takeaways.

Content Rules:
- Each slide must have exactly 3 to 5 bullet points.
- Each bullet point must be a clear, concise and complete sentence.
- Language and explanation must be appropriate and easy to understand for grade ${grade} students.
- Do not add filler or repetitive points; every bullet must add new information.
- Generate based on your best understanding of the topic. Do not ask for clarification.

Output Rules:
- Respond with ONLY a valid raw JSON object. No markdown, no code fences, no explanation.
- Strictly follow this schema:
{
  "title": "Presentation title",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide title",
      "bullets": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}
`;

// Fallback prompt: shorter and more directive for smaller models that struggle with long instructions
const buildFallbackPrompt = (topic, grade, numberOfSlides) => `
You are a school teacher. Create a PowerPoint presentation for grade ${grade} students.
Topic: "${topic}"
Total Slides: ${numberOfSlides}

Rules:
- Slide 1: welcome/introduction slide.
- Slides 2 to ${numberOfSlides - 1}: one distinct sub-concept per slide.
- Slide ${numberOfSlides}: closing/thank-you slide with key takeaways.
- Each slide: exactly 3 to 5 bullet points, clear and grade-appropriate.
- Do not ask questions. Generate immediately based on your understanding.
- Respond with ONLY raw JSON. No markdown. No extra text.

Schema:
{
  "title": string,
  "slides": [{ "slideNumber": number, "title": string, "bullets": string[] }]
}
`;

export { buildPrompt, buildFallbackPrompt };
