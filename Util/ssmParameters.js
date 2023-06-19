const aws = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const {
  DATABASE_URL,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  AWS_REGION,
} = require("../Common/constants");
const profileName = "default";
const credentials = new aws.SharedIniFileCredentials({ profile: profileName });
aws.config.credentials = credentials;
const ssmClient = new aws.SSM({
  region: AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const databaseConnection = [
  { parameter: DATABASE_URL, redableConfigName: "databaseUrl" },
  { parameter: DATABASE_USERNAME, redableConfigName: "databaseUsername" },
  { parameter: DATABASE_PASSWORD, redableConfigName: "databasePassword" },
];

const paramValues = {};

const loadSSMParameters = async () => {
  const params = {
    Names: databaseConnection.map(({ parameter }) => parameter),
    WithDecryption: true,
  };
  const response = await ssmClient.getParameters(params).promise();

  response.Parameters.forEach(({ Name, Value }) => {
    const { redableConfigName } = databaseConnection.find(
      ({ parameter }) => parameter === Name
    );
    paramValues[redableConfigName] = Value;
  });

  return paramValues;
};

getSSMValueByKey = (key) => {
  if (paramValues[key]) {
    return paramValues[key];
  }
  console.log(key + " not exist");
};

module.exports = {
  loadSSMParameters,
  getSSMValueByKey,
};
