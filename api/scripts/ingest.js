import "dotenv/config"
import fs from "fs"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"

const loader = new DirectoryLoader("./data", {
    ".pdf": (path) => new PDFLoader(path)
})

const loadedPDFs = await loader.load()

const splitters = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 300
})

const chunks = await splitters.splitDocuments(loadedPDFs)

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001"
})

const vectorStore = new MemoryVectorStore(embeddings)

const BATCH = 50
for (let i=0; i<chunks.length; i+=BATCH) {
    await vectorStore.addDocuments(chunks.slice(i, i + BATCH))
    console.log(`Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`)
    await new Promise(r => setTimeout(r, 1500))
}

fs.writeFileSync("./index.json", JSON.stringify(vectorStore.memoryVectors))
console.log("Index saved to index.json")
