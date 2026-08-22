import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


async function main() {
  const loader = new PDFLoader(
    "./285_OOPS lecture notes Complete.pdf",
    {splitPages:false}
  );

  const doc = await loader.load();
 const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 400, chunkOverlap: 100 })
  const texts = await splitter.splitText(doc[0].pageContent);
  console.log(texts.length)
}

main();