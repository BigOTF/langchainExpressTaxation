import "dotenv/config";
import express from "express"
import routes from "./routes/index.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import mongoose from "mongoose"

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL

const app = express()
app.use(express.json()) 

mongoose.connect(MONGODB_URL)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}));

app.use(routes)

app.get("/", (req, res) => {
    return res.status(200).send({ msg: "Welcome to the Taxation langchain api" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})