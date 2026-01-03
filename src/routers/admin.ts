import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { addAdmin, updatePassword } from "../controllers/admin.js";
const router = Router();

router.route("/")
  .post(addAdmin)
  .patch(verifyJWT, updatePassword)

export default router;