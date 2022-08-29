import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as path from 'path';

enum levels {
  error = 'error',
  warn = 'warn',
  info = 'info',
  http = 'http',
  verbose = 'verbose',
  debug = 'debug',
  silly = 'silly',
}

interface Iinfo {
  message: string;
  level: levels;
  timestamp: string;
}

const logDir = path.join(
  __dirname,
  '..',
  path.sep,
  '..',
  path.sep,
  '..',
  path.sep,
  'logs',
);
const { combine, timestamp, printf } = winston.format;

const logFormat = printf((info: Iinfo) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const error = new winstonDaily({
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir + '/error',
  filename: `%DATE%.error.log`,
  maxFiles: 30,
  zippedArchive: true,
});

export const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [error],
});
