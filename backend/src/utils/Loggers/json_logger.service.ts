import { LoggerService } from '@nestjs/common';

export class JsonLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(JSON.stringify({ level: 'info', message, context, ts: Date.now() }));
  }
  error(message: string, trace?: string, context?: string) {
    console.error(JSON.stringify({ level: 'error', message, trace, context, ts: Date.now() }));
  }
  warn(message: string, context?: string) {
    console.warn(JSON.stringify({ level: 'warn', message, context, ts: Date.now() }));
  }
  debug(message: string, context?: string) {
    console.debug(JSON.stringify({ level: 'debug', message, context, ts: Date.now() }));
  }
  verbose(message: string, context?: string) {
    console.log(JSON.stringify({ level: 'verbose', message, context, ts: Date.now() }));
  }
}
