// database.dynamic.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDatabaseService } from './database.provider';
import { MongoDatabaseService } from './database_mongodb.service';
import { PostgresDatabaseService } from './database_posrgresql_service';
import { AppConfig } from './app.config.provider';

@Module({})
export class DatabaseDynamicModule {
  static forRoot(config: AppConfig): DynamicModule {
    if (config.database.driver === 'mongodb') {
      return this.createMongoModule(config);
    } else if (config.database.driver === 'postgres') {
      return this.createPostgresModule(config);
    } else {
      throw new Error(`Unsupported database driver: ${config.database.driver}`);
    }
  }

  private static createMongoModule(config: AppConfig): DynamicModule {
    return {
      module: DatabaseDynamicModule,
      imports: [
        MongooseModule.forRoot(
          `${config.database.url}:${config.database.port}/${config.database.database_name}`
        ),
      ],
      providers: [
        {
          provide: 'IDatabaseService',
          useClass: MongoDatabaseService,
        },
      ],
      exports: ['IDatabaseService'],
    };
  }

  private static createPostgresModule(config: AppConfig): DynamicModule {
    return {
      module: DatabaseDynamicModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: config.database.url,
          port: parseInt(config.database.port, 10),
          username: config.database.username,
          password: config.database.password,
          database: config.database.database_name,
          autoLoadEntities: true,
          synchronize: false,
        }),
      ],
      providers: [
        {
          provide: 'IDatabaseService',
          useClass: PostgresDatabaseService,
        },
      ],
      exports: ['IDatabaseService'],
    };
  }
}