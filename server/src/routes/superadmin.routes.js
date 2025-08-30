import { Router } from "express";
import {
  loginUser,
  getAllUsers,
  getUserById,
  logOutUser,
  getAllMentor,
  GetUserDataByRole,
} from "../controllers/user.controller.js";
import { createUser } from "../controllers/superadmin.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/role.middleware.js";
import { validUser, validLogin } from "../middlewares/superadmin.middleware.js";

const router = Router();

router.post("/register", validUser, createUser);

router.post(
  "/createUser",
  verifyToken,
  authRole("SuperAdmin"),
  validUser,
  createUser
);
router.post("/login", validLogin, loginUser);
router.get("/logout", logOutUser);

router.get("/getAllUsers", verifyToken, authRole("SuperAdmin"), getAllUsers);
router.get(
  "/getUserById/:userId",
  verifyToken,
  authRole("SuperAdmin"),
  getUserById
);

router.get("/getAllMentors", verifyToken, authRole("SuperAdmin"), getAllMentor);
// router.get('/getAllClassTeacher', verifyToken, authRole("SuperAdmin"), getAllClassTeacher);

router.get("/GetUserDataByRole/:userId/:role", verifyToken, GetUserDataByRole);

export default router;
