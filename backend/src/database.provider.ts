import { AppConfig } from './app.config.provider';
import { MongoDatabaseService } from './database_mongodb.service';
import { PostgresDatabaseService } from './database_posrgresql_service';

export interface IDatabaseService {
  listDatabases(): Promise<string[]>;
}

export const DatabaseServiceProvider = {
  provide: 'IDatabaseService',
  useFactory: (
    config: AppConfig,
    mongoService: MongoDatabaseService,
    pgService: PostgresDatabaseService,
  ) => {
    if (config.database.driver === 'mongodb') {
      return mongoService;
    } else if (config.database.driver === 'postgres') {
      return pgService;
    }
    throw new Error('Unsupported database driver');
  },
  inject: ['CONFIG', MongoDatabaseService, PostgresDatabaseService],
};
