import { Router } from "express";
import upload from "../config/multer.js";
import { addStudent, getAllStudents, getStudent, getStudents, removeStudent, updateProfile } from "../controllers/student.js";
import verifyJWT from "../middlewares/verifyJWT.js";
const router = Router();
router.route("/")
    .post(verifyJWT, upload.single("photo"), addStudent)
    .get(getStudents);
router.route("/all")
    .get(getAllStudents);
router.route("/:id")
    .patch(verifyJWT, upload.single("photo"), updateProfile)
    .get(getStudent)
    .delete(verifyJWT, removeStudent);
export default router;
