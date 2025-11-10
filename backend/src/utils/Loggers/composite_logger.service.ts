import { LoggerService } from '@nestjs/common';
import { JsonLogger } from './json_logger.service';
import { TSKVLogger } from './tskv_logger.service';

export class CompositeLogger implements LoggerService {
  constructor(
    private readonly jsonLogger: JsonLogger,
    private readonly tskvLogger: TSKVLogger,
  ) {}

  log(message: string, context?: string) {
    this.jsonLogger.log(message, context);
    this.tskvLogger.log(message, context);
  }
  error(message: string, trace?: string, context?: string) {
    this.jsonLogger.error(message, trace, context);
    this.tskvLogger.error(message, trace, context);
  }
  warn(message: string, context?: string) {
    this.jsonLogger.warn(message, context);
    this.tskvLogger.warn(message, context);
  }
  debug(message: string, context?: string) {
    this.jsonLogger.debug(message, context);
    this.tskvLogger.debug(message, context);
  }
  verbose(message: string, context?: string) {
    this.jsonLogger.verbose(message, context);
    this.tskvLogger.verbose(message, context);
  }
}
