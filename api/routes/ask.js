import "dotenv/config";
import Router from "express"
import { body, validationResult } from "express-validator"
import { ask } from "../src/lib/rag.js"

const router = Router()

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

        const { question } = req.body
        const { sessionID } = req

        try {
            const results = await ask(question, sessionID)
            return res.json(results)
        } catch(err) {
            console.error(err)
            res.status(502).json({ err: "Could not get an answer right now" });
        }
    }
)

export default router