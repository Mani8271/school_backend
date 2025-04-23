const validator = require("validator");
const mongoose = require("mongoose");

const validateEditProfileData = (req) => {
  const editAllowFields = [
    "firstName",
    "lastName",
    "email",
    "mobileNumber",
    "profilePicture",
    "role",
    "status",
    "address",
  ];

  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }

  return true;
};

const validateEditHolidayData = (req) => {
  const editAllowFields = ["name", "description", "date", "_id"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditBlogData = (req) => {
  const editAllowFields = [
    "blogName",
    "blogImage",
    "blogCategory",
    "blogDescription",
    "_id",
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};
const validateEditBusListData = (req) => {
  const editAllowFields = ["busName", "busModel", "Capacity", "Status", "_id"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditBusRouteData = (req) => {
  const editAllowFields = [
    "Route",
    "BusAssigned",
    "Driver",
    "Conductor",
    "ConductorContact",
    "BusCapacity",
    "Students",
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditBusStaffData = (req) => {
  const editAllowFields = [
    "Role",
    "Contact",
    "Vehicle",
    "Route",
    "ProfilePhoto"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditStudentsData = (req) => {
  const editAllowFields = [
    "Class",
    "Section",
    "Address",
    "Email",
    "Mobile",
    "City"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditBusAssignData = (req) => {
  const editAllowFields = [
    "studentClass",
    "studentName",
   "route"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditTeachersData = (req) => {
  const editAllowFields = [
    "subject",
    "maritalStatus",
   "emergencyContactNumber",
   "mobileNumber",
   "address",
   "city"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditNonTeachersData = (req) => {
  const editAllowFields = [
    "subject",
    "maritalStatus",
   "emergencyContactNumber",
   "mobileNumber",
   "address",
   "city"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditTeachersTimetableData = (req) => {
  const editAllowFields = [
    "day",
    "time",
   "class",
   "subject",
   "teacher"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditExamData = (req) => {
  const editAllowFields = [
    "class",
    "section",
   "day",
   "examType",
   "date",
   "timeFrom",
   "timeTo",
   "subject",
   "lastSubmissiondate"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditExamResultData = (req) => {
  const editAllowFields = [
    "studentName",
    "examType",
   "class",
   "lang1",
   "lang2",
   "english",
   "maths",
   "science",
   "social"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};
const validateEditFeesData = (req) => {
  const editAllowFields = [
    "admissionNumber",
    "studentName",
   "section",
   "tutionFee",
   "transportFee",
   "stationaryFee",
   "admissionFee",
   "otherFees",
   "status"
  ];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditEventsData = (req) => {
  const editAllowFields = ["eventName", "description", "date", "_id","eventImage"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditAttendanceData = (req) => {
  const editAllowFields = ["attendance"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};
const validateEditStaffLeavesData = (req) => {
  const editAllowFields = ["status"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};
const validateEditCalendarData = (req) => {
  const editAllowFields = ["eventName", "description", "date", "_id"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditPayrollData = (req) => {
  const editAllowFields = ["employeeName", "netSalary", "basuc", "_id","tds","da","esi","hra","pf","conveyance","leaves","allowance","profTax","medicalAllowance"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};

const validateEditNoticeboardData = (req) => {
  const editAllowFields = ["noticeTitle","noticeDescription","noticeDate","time","noticeFile","_id"];
  const invalidFields = Object.keys(req.body).filter(
    (field) => !editAllowFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }
  return true;
};
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
module.exports = {
  validateEditProfileData,
  validateEditHolidayData,
  isValidObjectId,
  validateEditBlogData,
  validateEditBusListData,
  validateEditBusRouteData,
  validateEditBusStaffData,
  validateEditStudentsData,
  validateEditBusAssignData,
  validateEditTeachersData,
  validateEditNonTeachersData,
  validateEditTeachersTimetableData,
  validateEditExamData,
  validateEditExamResultData,
  validateEditEventsData,
  validateEditCalendarData,
  validateEditPayrollData,
  validateEditAttendanceData,
  validateEditStaffLeavesData,
  validateEditNoticeboardData,
  validateEditFeesData
};
