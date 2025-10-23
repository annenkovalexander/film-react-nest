import { Module } from '@nestjs/common';
import { DatabaseServiceProvider } from './database.provider';
import { AppConfigModule } from './app.config.module';
import { MongoDatabaseService } from './database_mongodb.service';
import { PostgresDatabaseService } from './database_posrgresql_service';

@Module({
  imports: [AppConfigModule],
  providers: [
    MongoDatabaseService,
    PostgresDatabaseService,
    DatabaseServiceProvider,
  ],
  exports: [DatabaseServiceProvider],
})
export class DatabaseModule {}
