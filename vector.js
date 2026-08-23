import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});


export const vectorStore = await Chroma.fromExistingCollection(
  embeddings,
  {
    collectionName: "oops-notes-v2",
    host: "localhost",
    port: 8000,
    ssl: false,
  }
);