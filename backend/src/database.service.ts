import { Module } from '@nestjs/common';
import { MongoDatabaseService } from './database_mongodb.service';
import { PostgresDatabaseService } from './database_posrgresql_service';
import { DatabaseServiceProvider } from './database.provider';

@Module({
  providers: [
    MongoDatabaseService,
    PostgresDatabaseService,
    DatabaseServiceProvider,
  ],
  exports: ['IDatabaseService'],
})
export class DatabaseService {}
