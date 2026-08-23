import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";

async function main(params) {
  const filepath = "./285_OOPS lecture notes Complete.pdf";

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

  const cleanedChunks = chunks.map((doc) => ({
    ...doc,
    metadata: {
      source: String(doc.metadata.source ?? ""),
    },
  }));

  const embeddings = new HuggingFaceTransformersEmbeddings({
    model: "Xenova/all-MiniLM-L6-v2",
  });

  await Chroma.fromDocuments(cleanedChunks, embeddings, {
    collectionName: "oops-notes-v2",
    host: "localhost",
    port: 8000,
    ssl: false,
  });
}

main();
