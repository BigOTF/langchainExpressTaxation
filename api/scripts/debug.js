import "dotenv/config"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const vectors = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../index.json"), "utf-8"))

// 1. Are all 3 PDFs in the index?
const counts = {}
for (const v of vectors) {
    const f = path.basename(v.metadata.source)
    counts[f] = (counts[f] ?? 0) + 1
}
console.log("chunks per file:", counts)
console.log("stored dimension:", vectors[0].embedding.length)

// 2. Does the query vector match?
const embeddings = new GoogleGenerativeAIEmbeddings({ model: "gemini-embedding-001" })
const q = await embeddings.embedQuery("what is the punishment for tax evasion")
console.log("query dimension:", q.length)

// 3. Do the scores make sense?
const cos = (a, b) => {
    let d = 0, na = 0, nb = 0
    for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2 }
    return d / (Math.sqrt(na) * Math.sqrt(nb))
}
const top = vectors
    .map(v => ({ s: cos(q, v.embedding), v }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 5)
for (const { s, v } of top)
    console.log(s.toFixed(4), path.basename(v.metadata.source), "p" + v.metadata.loc?.pageNumber, v.content.slice(0, 80).replace(/\s+/g, " "))