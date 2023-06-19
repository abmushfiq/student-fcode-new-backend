const express = require("express");
require('dotenv').config()
const bodyParser = require("body-parser");

const { loadConfigs } = require("../Configs/loadConfigs");
const { getStudents, addStudent, deleteStudent, updateStudent,deleteAllStudents } = require("../Controllers/studentController");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "*"
}));
app.use(bodyParser.json({ type: "application/*+json" }));

app.set("client", loadConfigs());

app.get("/", getStudents );

app.post("/students", addStudent);

app.delete("/students/:id", deleteStudent);

app.put("/students/:id", updateStudent);

app.delete("/all-students", deleteAllStudents);

app.listen(8000, () => {
  console.log("Listening on port:3001🚀");
});
