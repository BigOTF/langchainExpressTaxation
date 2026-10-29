import "dotenv/config";
import express from "express"
import routes from "./routes/index.js"

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json()) 

app.use(routes)

app.get("/", (req, res) => {
    return res.status(200).send({ msg: "Welcome to the Taxation langchain api" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})