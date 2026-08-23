import { indexDocument } from "./rag.js"

const path = './285_OOPS lecture notes Complete.pdf'

export const vectorStore = await indexDocument(path);