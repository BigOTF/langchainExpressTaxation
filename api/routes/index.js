import Router from "express"
import askRoutes from "./ask.js"

const router = Router()

router.use(askRoutes)


export default router