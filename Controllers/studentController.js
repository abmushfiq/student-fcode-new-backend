const {
  getStudentsService,
  addStudentService,
  deleteStudentService,
  updateStudentService,
  deleteAllStudentsService
} = require("../Services/studentService");
const moment = require("moment");
const getStudents = async (req, res) => {
  try {
    const students = await getStudentsService();
    if (!students) return res.json("Error in getStudents").status(404);
    const updatedStudents = students.map((student) => {
      const date = new Date(student.data_of_birth);
      const formattedDate = date.toLocaleString("en-US", {
        timeZone: "UTC",
        timeZoneName: "short",
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      return {
        ...student,
        // date_of_birth: new Date(student.data_of_birth).toLocaleDateString(),
        date_of_birth: formattedDate,
      };
    });

    return res.send(updatedStudents);
  } catch (error) {
    console.log(error);
  }
};

const addStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = await addStudentService(studentData);
    if (!student) return res.json("Error in addStudent").status(404);
    return res.send(student);
  } catch (error) {
    console.log(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log(studentId, " to be deleted");
    const user = await deleteStudentService(studentId);
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudent = req.body;
    const student = await updateStudentService(updatedStudent, studentId);    
    return res.send(student);
    // return res.send("updated");
  } catch (error) {
    console.log(error);
  }
};

const deleteAllStudents = async (req, res) => {
  try {
    const students = await deleteAllStudentsService();
    return res.send(students);
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  deleteAllStudents
};
