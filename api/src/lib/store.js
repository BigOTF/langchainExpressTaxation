import "dotenv/config"
import fs from "fs"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory"

const embeddings = new GoogleGenerativeAIEmbeddings({ 
    model: "gemini-embedding-001" 
})

export function loadStore() {
    if (!fs.existsSync("./index.json")) {
        throw new Error("index.json not found. Run: node ingest.js")
    }
    const store = new MemoryVectorStore(embeddings)
    store.memoryVectors = JSON.parse(fs.readFileSync("./index.json", "utf-8"))
    return store
}