import winston from 'winston';
import chalk from 'chalk';
import 'winston-daily-rotate-file';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

// Custom format for console output with colors
const consoleFormat = printf(({ level, message, timestamp }) => {
    const ts = chalk.gray(timestamp);
    
    switch (level) {
        case 'info':
            return `${ts} ${chalk.blue('ℹ')} ${chalk.blue(message)}`;
        case 'warn':
            return `${ts} ${chalk.yellow('⚠')} ${chalk.yellow(message)}`;
        case 'error':
            return `${ts} ${chalk.red('✖')} ${chalk.red(message)}`;
        case 'debug':
            return `${ts} ${chalk.magenta('🔍')} ${chalk.magenta(message)}`;
        default:
            return `${ts} ${message}`;
    }
});

// Create the logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json()
    ),
    transports: [
        // Console transport with colors
        new transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleFormat
            )
        }),
        // File transport for errors
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // File transport for all logs
        new transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

export default logger;
