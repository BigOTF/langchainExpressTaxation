import "dotenv/config";
import Router from "express"
import { body, validationResult } from "express-validator"

const router = Router()
const URL = process.env.lANGCHAIN_API_URL

router.post("/api/ask", 
    body("question")
        .isString().withMessage("Question must be a string")
        .trim()
        .notEmpty().withMessage("Question field must not be empty")
        .isLength({ max: 500 }).withMessage("The Question must be 500 max words"),
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty())
            return res.status(400).send({ errors: errors.array() })

        try {
            const langChainAPI = await fetch(URL, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ question: req.body.question, session_id: req.sessionID })
            })

            if(!langChainAPI.ok)
                throw new Error("LANGCHAIN AI ERROR")

            const langChainAPIResponse = await langChainAPI.json()
            return res.json(langChainAPIResponse)
        } catch(err) {
            res.status(502).json({ err: "Could not get an answer right now" });
        }
    }
)

export default router