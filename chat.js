import readline from "readline/promises";

import Groq from "groq-sdk";
import { vectorStore } from "./prepair.js";

const groq = new Groq({ apiKey: process.env.GROQ_API });
async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const question = await rl.question("ask: ");

    if (question == "/bye") break;

    const releventChunk = await vectorStore.similaritySearch(question, 4);
    const context = releventChunk
      .map((chunk) => chunk.pageContent)
      .join("\n\n");
    const SYSTEM_PROMPT = `You are an assistant for question-answering tasks. Use the following relevant pieces of retrieved context to answer the question. If you don't know the answer, say I don't know.`;
    const userQuery = `Question: ${question}
        Relevant context: ${context}
        Answer:`;

    const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            model: 'openai/gpt-oss-120b',
        });
         console.log(`Assistant: ${completion.choices[0].message.content}`);
  }
  rl.close();
}

chat();