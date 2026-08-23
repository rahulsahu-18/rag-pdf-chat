import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

// 1. Load PDF

export async function indexDocument(filepath) {
  const loader = new PDFLoader(filepath, {
    splitPages: false,
  });

  const docs = await loader.load();

  // 2. Split document
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 150,
  });

  const chunks = await splitter.splitDocuments(docs);

  console.log("Total chunks:", chunks.length);

  const cleanedChunks = chunks.map((doc) => ({
    ...doc,
    metadata: {
      source: String(doc.metadata.source ?? ""),
    },
  }));

  const vectorstore = await Chroma.fromDocuments(cleanedChunks, embeddings, {
    collectionName: "oops-notes-v2",
    host: "localhost",
    port: 8000,
    ssl: false,
  });

  return vectorstore;
}
