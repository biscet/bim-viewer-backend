import express from "express";

import obtainToken from "../middleware/obtainToken";
import { postTranslate } from "../controllers/modelderivative";

const router = express.Router();

router.use(obtainToken);

router.post("/translate", postTranslate);

export default router;
