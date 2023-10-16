const winston = require("winston");
const config = require("./config");

const roothPath = config.rootPath;

function createLogger(controllerName) {
  const consoleFormat = winston.format.combine(
    winston.format.colorize({
      all: true,
      colors: { error: "red", warn: "green", info: "cyan" },
    }),
    winston.format.printf(
      ({ level, message }) => `[${level.toUpperCase()}] ${message}`
    )
  );

  let filename;
  switch (config.winstonConf) {
    case "LOCAL":
      filename = `${roothPath}/logs/${controllerName}.log`;
      break;
    case "SERVER":
      filename = `/app/logs/errors.log`;
      break;
  }

  const options = {
    file: {
      level: "info",
      filename,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    },
    console: {
      level: "debug",
      handleExceptions: true,
      json: false,
      format: consoleFormat,
    },
  };

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: { error: "red", warn: "green", info: "cyan" },
          }),
          consoleFormat
        ),
        ...options.console,
      }),
      new winston.transports.File({
        format: winston.format.combine(winston.format.json()),
        ...options.file,
      }),
    ],
    exitOnError: false,
  });

  logger.stream = {
    write: function (message, encoding) {
      logger.info(message);
    },
  };

  return logger;
}

module.exports = createLogger;
