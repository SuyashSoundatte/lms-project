import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import authRole from "../middlewares/role.middleware.js";
import { assignClassTeacher } from "../controllers/teacher.controller.js";
import {markAttendance, getAttendanceByDateRange, getStudentAttendanceStats, updateAttendance, createClass, getAttendanceByPhone, getAllAttendanceReport} from "../controllers/attendace.controller.js";

const router = Router();

router.post('/assignClassTeacher', verifyToken, authRole("SuperAdmin"), assignClassTeacher)

router.post('/markAttendance', verifyToken, authRole("ClassTeacher", "SuperAdmin"), markAttendance)

router.get('/attendance', verifyToken, authRole("ClassTeacher", "SuperAdmin"), getAttendanceByDateRange);

router.get('/attendance/student/:studentId', verifyToken, authRole("ClassTeacher", "SuperAdmin"), getStudentAttendanceStats);

router.put('/attendance/:attendanceId', verifyToken, authRole("ClassTeacher", "SuperAdmin"), updateAttendance);

router.post('/createClass', verifyToken, authRole("ClassTeacher", "SuperAdmin"), createClass)

router.get('/getAttendanceByPhone/:phone', verifyToken, getAttendanceByPhone)

router.get('/getAllAttendanceReport', verifyToken, getAllAttendanceReport)

export default router;