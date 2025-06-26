// Jenalee Nguyen 6.25.25
// Modified to return game reviews

// Import Modules +++
import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createInterface } from "readline";

// Setup readline for user input +++
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// Main function +++
async function main() {
  const gameName = await ask("Enter the name of the game you want reviewed: ");
  
  // Ask for specific aspects to focus on +++
  const focusAreas = await ask("Any specific aspects you want the review to focus on? (e.g., graphics, gameplay, story - or leave blank): ");

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", `You are a knowledgeable video game critic. Provide a detailed review of the game {gameName}. 
     ${focusAreas ? 'Focus particularly on: ' + focusAreas : 'Cover various aspects like gameplay, graphics, story, and overall experience.'}
     Be balanced, mentioning both strengths and weaknesses.`],
    ["user", "Please review {gameName}"],
  ]);

  const promptValue = await promptTemplate.invoke({ 
    gameName,
    focusAreas: focusAreas || 'general aspects' 
  });

  const response = await model.invoke(promptValue);

  console.log(`\nReview of ${gameName}:`);
  console.log(response.content);

  rl.close();
}

main();