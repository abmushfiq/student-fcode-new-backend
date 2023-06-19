const { databaseInit } = require("../Services/studentService")
const { loadSSMParameters } = require("../Util/ssmParameters")



 const loadConfigs = async () => {
   return loadSSMParameters().then(async()=>{
    return databaseInit().then(async()=>{
      console.log("Database is started to connect🚀")
    })
  })
  
}

module.exports = {
    loadConfigs
}