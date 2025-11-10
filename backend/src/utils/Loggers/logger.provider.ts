
import { DevLogger } from './dev_logger.service';
import { CompositeLogger } from './composite_logger.service';
import { AppConfig } from 'src/app.config.provider';

export const LoggerProvider = {
  provide: 'APP_LOGGER',
  useFactory: (
    config: AppConfig,
    devLogger: DevLogger,
    compositeLogger: CompositeLogger,
  ) => {
    switch (config.logger.env_type) {
      case 'development':
        return devLogger;
      default:
        return compositeLogger;
    }
  },
  inject: ['CONFIG', DevLogger, CompositeLogger],
};
