const { Client } = require("pg");
const { DATABASE_PORT, DATABASE_NAME } = require("../Common/constants");
const moment = require("moment");


var client = null;

const databaseInit = async () => {
  client = new Client({
    host: getSSMValueByKey("databaseUrl"),
    user: getSSMValueByKey("databaseUsername"),
    password: getSSMValueByKey("databasePassword"),
    port: DATABASE_PORT,
    database: DATABASE_NAME,
  });

  
  client
    .connect()
    .then(() => console.log("Database connected successfuly🚀"))
    .then(() => {
      client.query(`
    CREATE TABLE IF NOT EXISTS student
    (
        _id SERIAL not null PRIMARY KEY,
        created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        id varchar(10),
        student_name varchar(100) not null,
        registration_number varchar(100) not null,
        gender varchar(20),
        address varchar(100),
        age INT,
        mobile_number varchar(20),
        data_of_birth date not null
    );
  `);
    })
   
    .catch((e) => console.log(e));
  // .finally(()=> client.end())

  return client;
};

const addStudentService = async (student) => {
  const values = [student.id,student.student_name, student.registration_number, student.gender,student.address,student.age,student.mobile_number,moment(student.data_of_birth).format("YYYY-MM-DD")];
  const result = await client.query(
    `
        INSERT INTO student (id,student_name, registration_number, gender, address, age, mobile_number, data_of_birth)
        VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
        RETURNING *;
    `,
    values
  );

  return result;
};

const getStudentsService = async () => {
  const students = await client.query(`SELECT * FROM student`);
  return students.rows;
};

const updateStudentService = async(student, studentId)=>{
  const values = [student.student_name, student.registration_number, student.gender,student.address,student.age,student.mobile_number,student.data_of_birth, studentId];
  const updatedStudent = await client.query(
    `
    UPDATE STUDENT SET 
    student_name = $1, registration_number = $2, gender = $3, address = $4, age = $5, mobile_number = $6, data_of_birth = $7
    WHERE ID = $8
    `,
    values
  )
    const _updatedStudent = await getStudentByIdService(studentId) 
    console.log(_updatedStudent)
    return _updatedStudent

}

const deleteStudentService= async(studentId)=>{
  const deletedStudent = await getStudentByIdService(studentId)
   await client.query(
    `
    DELETE FROM student 
    WHERE ID = $1
    `,
    [studentId]
    )
    return deletedStudent
   
}

const deleteAllStudentsService = async()=>{
  await client.query(
    `
    DELETE FROM student
    `
  )
}

const getStudentByIdService = async(studentId)=>{
  const student= await client.query(
    `
    SELECT * FROM student
    WHERE ID = $1
    `,
    [studentId]
  )
  return student.rows[0]
}
    







module.exports = {
  databaseInit,
  addStudentService,
  getStudentsService,
  deleteStudentService,
  updateStudentService,
  deleteAllStudentsService
};
