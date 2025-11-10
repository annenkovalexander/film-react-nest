// database.dynamic.module.ts
import { DynamicModule, Global, Module } from '@nestjs/common';
import { MongoDatabaseModule } from './database/mongo-database.module';
import { PostgresDatabaseModule } from './database/postgres-database.module';

@Global()
@Module({})
export class DatabaseDynamicModule {
  static forRootAsync(): DynamicModule {
    const driver = process?.env?.DATABASE_DRIVER || 'postgres';
    if (driver === 'mongodb') {
      return MongoDatabaseModule.create();
    } else if (driver === 'postgres') {
      return PostgresDatabaseModule.create();
    } else {
      throw new Error(`Unsupported DATABASE_DRIVER: ${driver}`);
    }
  }
}