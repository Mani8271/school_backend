const express = require("express");
const app = express();
const ConnectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");  // Import cors

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"]  // Expose Authorization header if needed
}));


const systemUser = require("./src/Dashboard/routes/SystemUsers")
const Holidays = require("./src/Dashboard/routes/Holidays")
const Blogs = require("./src/Dashboard/routes/Blogs")
const Comments = require("./src/Dashboard/routes/Comments")
const BusList = require("./src/Dashboard/routes/BusList")
const Classes = require("./src/Dashboard/routes/Classes")
const BusAssign = require("./src/Dashboard/routes/BusAssign")
const BusRoutes = require("./src/Dashboard/routes/BusRoutes")
const BusStaff = require("./src/Dashboard/routes/BusStaff")
const ClassTimetable = require("./src/Dashboard/routes/ClassTimeTable")
const Events = require("./src/Dashboard/routes/Events")
const ExamList = require("./src/Dashboard/routes/ExamList")
const ExamResult = require("./src/Dashboard/routes/ExamResult")
const Fees = require("./src/Dashboard/routes/Fees")
const NonTeachingStaff = require("./src/Dashboard/routes/NonTeachingStaff")
const Notifications = require("./src/Dashboard/routes/Notifications")
const Payroll = require("./src/Dashboard/routes/Payroll")
const SectionList = require("./src/Dashboard/routes/SectionList")
const StaffDailyAttendance = require("./src/Dashboard/routes/StaffDailyAttendance")
const StaffMonthlyAttendance = require("./src/Dashboard/routes/StaffMonthlyAttendance")
const Students = require("./src/Dashboard/routes/Students")
const TeachersTimetable = require("./src/Dashboard/routes/TeachersTimetable")
const TeachingStaff = require("./src/Dashboard/routes/TeachingStaff")
const StaffLeaveRequests = require("./src/Dashboard/routes/StaffLeaves")
const NoticeBoard = require("./src/Dashboard/routes/NoticeBoard")

const holidays = require("./src/App/routes/Holidays");
const busList = require("./src/App/routes/BusList");
const classes = require("./src/App/routes/Classes");
const busRoutes = require("./src/App/routes/BusRoutes");
const busStaff = require("./src/App/routes/BusStaff");
const classTimetable = require("./src/App/routes/ClassTimeTable");
const events = require("./src/App/routes/Events");
const examList = require("./src/App/routes/ExamList");
const examResult = require("./src/App/routes/ExamResult");
const fees = require("./src/App/routes/Fees");
const nonTeachingStaff = require("./src/App/routes/NonTeachingStaff");
const notifications = require("./src/App/routes/Notifications");
const payroll = require("./src/App/routes/Payroll");
const sectionList = require("./src/App/routes/SectionList");
const staffDailyAttendance = require("./src/App/routes/StaffDailyAttendance");
const staffMonthlyAttendance = require("./src/App/routes/StaffMonthlyAttendance");
const students = require("./src/App/routes/Students");
const teachersTimetable = require("./src/App/routes/TeachersTimetable");
const teachingStaff = require("./src/App/routes/TeachingStaff");
const staffLeaveRequests = require("./src/App/routes/StaffLeaves");
const noticeBoard = require("./src/App/routes/NoticeBoard");
const complaints = require("./src/App/routes/Complaints");
const assignHomeworks = require("./src/App/routes/AssignHomework");
const studentLeaveRequests = require("./src/App/routes/StudentLeaveRequets");
const studentHomework = require("./src/App/routes/StudentHomework");
const Studentattendances = require("./src/App/routes/StudentAttendance")
const Teachercomplaints =require("./src/App/routes/TeacherComplaints")


app.use("/systemUsers",systemUser)
app.use("/holidays",Holidays)
app.use("/blogs",Blogs)
app.use("/comments",Comments)
app.use("/buslist",BusList)
app.use("/classes",Classes)
app.use("/busAssign",BusAssign)
app.use("/busRoutes",BusRoutes)
app.use("/busStaff",BusStaff)
app.use("/classTimetable",ClassTimetable)
app.use("/events",Events)
app.use("/examList",ExamList)
app.use("/examResult",ExamResult)
app.use("/nonTeachingstaff",NonTeachingStaff)
app.use("/fees",Fees)
app.use("/notifications",Notifications)
app.use("/payroll",Payroll)
app.use("/sectionList",SectionList)
app.use("/staffDailyattendance",StaffDailyAttendance)
app.use("/staffMonthlyattendance",StaffMonthlyAttendance)
app.use("/students",Students)
app.use("/teachersTimetable",TeachersTimetable)
app.use("/teachingStaff",TeachingStaff)
app.use("/staffLeaves",StaffLeaveRequests)
app.use("/noticeBoard",NoticeBoard)


app.use("/app/holidays", holidays);
app.use("/app/buslist", busList);
app.use("/app/classes", classes);
app.use("/app/busRoutes", busRoutes);
app.use("/app/busStaff", busStaff);
app.use("/app/classTimetable", classTimetable);
app.use("/app/events", events);
app.use("/app/examList", examList);
app.use("/app/examResult", examResult);
app.use("/app/nonTeachingstaff", nonTeachingStaff);
app.use("/app/fees", fees);
app.use("/app/notifications", notifications);
app.use("/app/payroll", payroll);
app.use("/app/sectionList", sectionList);
app.use("/app/staffDailyattendance", staffDailyAttendance);
app.use("/app/staffMonthlyattendance", staffMonthlyAttendance);
app.use("/app/students", students);
app.use("/app/teachersTimetable", teachersTimetable);
app.use("/app/teachingStaff", teachingStaff);
app.use("/app/staffLeaves", staffLeaveRequests);
app.use("/app/noticeBoard", noticeBoard);
app.use("/app/complaints", complaints);
app.use("/app/assignhomework", assignHomeworks);
app.use("/app/studentleaves", studentLeaveRequests);
app.use("/app/studenthomework", studentHomework);
app.use("/app/Teachercomplaints",Teachercomplaints );
app.use("/app/studentattendance",Studentattendances );

ConnectDB().then(() => {
  try {
    console.log("Database connection established...!");
    app.listen(3000, () => {
      console.log("server is running on port 3000 successfully");
    });
  } catch (error) {
    console.log("Database connection failed....!");
  }
});
