import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  // 1. Load PDF
  const loader = new PDFLoader(
    "./285_OOPS lecture notes Complete.pdf",
    {
      splitPages: false,
    }
  );

  const docs = await loader.load();

  // 2. Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitText(docs[0].pageContent);

  console.log("Total chunks:", chunks.length);

  // 3. Create embedding model
  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });

  // 4. Generate embedding for first chunk
  const vector = await embeddings.embedQuery(chunks[0]);

  console.log("First chunk:");
  console.log(chunks[0]);

  console.log("\nEmbedding:");
  console.log(vector);

  console.log("\nEmbedding dimensions:", vector.length);
}

main();