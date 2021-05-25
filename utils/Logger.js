const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
 
const zedRunFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
      label({ label: 'ZedRun API Testing'}),
      timestamp(),
      zedRunFormat
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: combine(colorize(), zedRunFormat)}),
    new transports.File({ filename: "error.log", level: "error" }),
  ]
});

exports.logger = logger;
