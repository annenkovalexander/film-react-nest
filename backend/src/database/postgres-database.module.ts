// database/postgres-database.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { DatabaseService } from '../database.service';
import { AppConfig } from 'src/app.config.provider';

@Global()
@Module({})
export class PostgresDatabaseModule {
  static create(): DynamicModule {
    const imports = [
      AppConfigModule,
      TypeOrmModule.forRootAsync({
        imports: [AppConfigModule],
        useFactory: (config: AppConfig): any => ({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(config.database.port || '5432', 10),
          username: config.database.username,
          password: config.database.password,
          database: config.database.database_name,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        inject: ['CONFIG'],
      }),
    ];

    const providers: Provider[] = [
      {
        provide: DatabaseService,
        useFactory: (config: AppConfig, dataSource: any) => {
          return new DatabaseService(config, undefined, dataSource);
        },
        inject: ['CONFIG', getDataSourceToken()],
      },
    ];

    return {
      module: PostgresDatabaseModule,
      imports,
      providers,
      exports: [DatabaseService],
    };
  }
}
