import winston from 'winston';
import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { config } from '../config/index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${message}`;

  // Add stack trace for errors
  if (stack) {
    log += `\n${stack}`;
  }

  // Add metadata if present
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }

  return log;
});

// Ensure log directory exists
const logDir = config.LOG_DIR;
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
  level: config.IS_PRODUCTION ? 'info' : 'debug',
  levels: { error: 0, warn: 1, info: 2, debug: 3, trace: 4, verbose: 5, silly: 6 },
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // File transport for errors
    new winston.transports.File({
      filename: resolve(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: resolve(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

export default logger;