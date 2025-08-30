import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/role.middleware.js";

import {
  getAllocatedTeachers,
  getAllocatedClassTeachers,
  getAllocatedMentors,
  getUnallocatedTeachers,
  getUnallocatedClassTeachers,
  getUnallocatedMentors,
  removeAllocation,
  getAllocatedStudents,
  getUnallocatedStudents,
} from "../controllers/allocation.controller.js";

const router = Router();

// Allocated
router.get(
  "/getAllocatedTeachers",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getAllocatedTeachers
);
router.get(
  "/getAllocatedClassTeachers",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getAllocatedClassTeachers
);
router.get(
  "/getAllocatedMentors",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getAllocatedMentors
);

// Unallocated
router.get(
  "/getUnallocatedTeachers",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getUnallocatedTeachers
);
router.get(
  "/getUnallocatedClassTeachers",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getUnallocatedClassTeachers
);
router.get(
  "/getUnallocatedMentors",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  getUnallocatedMentors
);

// Remove allocation
router.delete(
  "/removeAllocation/:allocation_id",
  verifyToken,
  authRole("OfficeStaff", "SuperAdmin"),
  removeAllocation
);

//allocation student
router.get("/getAllocatedStudents", getAllocatedStudents);
router.get("/getUnallocatedStudents", getUnallocatedStudents);

export default router;
