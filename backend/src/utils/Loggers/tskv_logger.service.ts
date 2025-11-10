import { LoggerService } from '@nestjs/common';

export class TSKVLogger implements LoggerService {
  log(message: string, context?: string) {
    console.log(this.tsmessage('info', message, context));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(this.tsmessage('error', message, context, trace));
  }

  warn(message: string, context?: string) {
    console.warn(this.tsmessage('warn', message, context));
  }

  debug(message: string, context?: string) {
    console.debug(this.tsmessage('debug', message, context));
  }

  verbose(message: string, context?: string) {
    console.log(this.tsmessage('verbose', message, context));
  }

  private tsmessage(
    level: string,
    message: string,
    context?: string,
    trace?: string
  ): string {
    const entries: string[] = [
      `level=${level}`,
      `ts=${Date.now()}`,
      `msg=${this.escape(message)}`
    ];
    if (context) entries.push(`context=${this.escape(context)}`);
    if (trace) entries.push(`trace=${this.escape(trace)}`);
    return entries.join('\t');
  }

  private escape(val: any): string {
  if (val === undefined || val === null) return '';
    return String(val).replace(/\t/g, ' ').replace(/[\r\n]+/g, '\\n');
  }
}