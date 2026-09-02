import {transports, format } from 'winston';

export function options(scenarioName: string) {
    return {
        transports: [
            new transports.File({
                filename: `test-result/logs/${scenarioName}.log`,
                level: 'info',
                format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    format.align(),
                    format.printf(info => `${info.level.toUpperCase()}: ${[info.timestamp]}: ${info.message}`)
                )
            })
        ]
    };
}