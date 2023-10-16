require("dotenv").config();

let path 	= require("path");
const rootPath = path.normalize(path.join(__dirname, ".."));

const params = [
  "PORT",
  "NODE_ENV",
  "DATABASE_DEV",
  "VERSION",
  "REDIS_HOST",
  "REDIS_PORT",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "EXPIRESIN",
  "WINSTON_CONF",
];

for (const param of params) {
  if (!process.env[param]) {
    throw new Error(`"${param}" must be defined`);
  }
}

const config = {
  // general config
  rootPath: rootPath,
  port: process.env.PORT,
  apiVersion: process.env.VERSION,
  environment: process.env.NODE_ENV,

  // database config
  development: {
    database: process.env.DATABASE_DEV,
  },
  test: {
    database: process.env.DATABASE_TEST,
  },
  production: {
    database: process.env.DATABASE_PROD,
  },

  // redis config
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,

  // winston config
  winstonConf: process.env.WINSTON_CONF,

  // token config
  accessToken: process.env.ACCESS_TOKEN_SECRET,
  refreshToken: process.env.REFRESH_TOKEN_SECRET,
  tokenExpiresIn: process.env.EXPIRESIN,

  // nodemailer config
  googleUser: process.env.GOOGLE_USER,
  googlePassword: process.env.GOOGLE_PASSWORD,

};
  
module.exports = config;