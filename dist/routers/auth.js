import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { refresh, signin, signout } from "../controllers/auth.js";
const router = Router();
router.post("/", signin);
router.get("/refresh", refresh);
router.post("/signout", verifyJWT, signout);
export default router;
