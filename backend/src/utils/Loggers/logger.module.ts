import { Module } from '@nestjs/common';
import { JsonLogger } from './json_logger.service';
import { TSKVLogger } from './tskv_logger.service';
import { CompositeLogger } from './composite_logger.service';
import { DevLogger } from './dev_logger.service';

@Module({
  providers: [
    JsonLogger,
    TSKVLogger,
    DevLogger,
    {
      provide: CompositeLogger,
      useFactory: (jsonLogger: JsonLogger, tskvLogger: TSKVLogger) =>
        new CompositeLogger(jsonLogger, tskvLogger),
      inject: [JsonLogger, TSKVLogger],
    },
  ],
  exports: [JsonLogger, TSKVLogger, DevLogger, CompositeLogger],
})
export class LoggerModule {}
