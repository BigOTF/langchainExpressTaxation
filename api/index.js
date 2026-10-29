import "dotenv/config";
import express from "express"
import routes from "./routes/index.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import mongoose from "mongoose"

const PORT = process.env.PORT || 3000
const MONGODB_URL = process.env.MONGODB_URL
const SESSION_SECRET = process.env.SESSION_SECRET

if (!MONGODB_URL || !SESSION_SECRET)
    throw new Error("Missing MONGODB_URL or SESSION_SECRET")

const app = express()
app.use(express.json()) 

mongoose.connect(MONGODB_URL)
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.log(`Error: ${err}`))

app.set("trust proxy", 1)

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
}));

app.use(routes)

app.get("/", (req, res) => {
    return res.status(200).send({ msg: "Welcome to the Taxation langchain api" })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})