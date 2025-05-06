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

const validateSystemUserData = (req) => {
  const errors = [];

  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    userTitle,
    address,
    role,
    status,
    password,
  } = req.body;

  // Validate firstName
  if (!firstName || typeof firstName !== "string" || firstName.trim().length < 4 || firstName.trim().length > 50) {
    errors.push("First name must be between 4 and 50 characters.");
  }

  // Validate lastName (optional)
  if (lastName && typeof lastName !== "string") {
    errors.push("Last name must be a string.");
  }

  // Validate email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  // Validate mobile number
  if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
    errors.push("Mobile number must be a 10-digit number.");
  }

  // Validate user title
  if (!["Mr", "Mrs", "Miss"].includes(userTitle)) {
    errors.push("User title must be 'Mr', 'Mrs', or 'Miss'.");
  }

  // Validate role
  if (!["Super Admin", "Admin"].includes(role)) {
    errors.push("Role must be 'Super Admin' or 'Admin'.");
  }

  // Validate status
  if (!["Active", "Inactive", "Pending"].includes(status)) {
    errors.push("Status must be 'Active', 'Inactive' or 'Pending'.");
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push("Password is required and must be at least 6 characters long.");
  }

  // If errors found, throw
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
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
  validateEditFeesData,
  validateSystemUserData
};
