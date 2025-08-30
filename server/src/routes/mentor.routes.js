import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/role.middleware.js";
import { assignMentor } from "../controllers/teacher.controller.js";
import {
  submitFeedback,
  getFeedbacks,
  updateFeedback,
  getStudentFeedbacks,
} from "../controllers/feedback.controller.js";
import { getAllMentor } from "../controllers/user.controller.js";

const router = Router();

router.post("/assignMentor", verifyToken, authRole("SuperAdmin"), assignMentor);

router.post(
  "/getAllMentors",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getAllMentor
);

router.post("/submitFeedback", submitFeedback);

router.get("/getFeedbacks", getFeedbacks);

router.put("/updateFeedback/:feedbackId", updateFeedback);

router.get("/getStudentFeedbacks/:studentId", getStudentFeedbacks);

export default router;
