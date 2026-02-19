import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateFlashCards(texts: string[]) {
  const prompt = `
    You are an English-Ukrainian language expert. 
    Task: Create Anki flashcards for the following English texts: ${JSON.stringify(texts)}.
    
    Instructions:
    1. Translate everything into Ukrainian for the "translation" field.
    2. Provide a clear explanation in English for the "back" field.
    3. Ensure the "example" is a natural English sentence.
    4. The "type" must be one of: "word", "phrase", "sentence", "phrasal_verb".

    Return ONLY a JSON array of objects. 
    Example format:
    [
      {
        "front": "persistent",
        "back": "continuing firmly in a course of action in spite of difficulty",
        "example": "He was persistent in his questioning.",
        "translation": "настійливий",
        "type": "word"
      }
    ]
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that outputs only JSON arrays." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const responseText = chatCompletion.choices[0]?.message?.content;
    
    if (!responseText) return [];

    const parsed = JSON.parse(responseText);
    return Array.isArray(parsed) ? parsed : Object.values(parsed)[0];
    
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
}