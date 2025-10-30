// database/postgres-database.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { DatabaseService } from '../database.service';
import {
  FILM_REPOSITORY_TOKEN,
  ORDER_REPOSITORY_TOKEN,
} from '../shared/di-tokens';
import { OrderPostgresRepository } from '../repository/postgres/repository/order.repository';
import { FilmPostgresRepository } from '../repository/postgres/repository/film.repository';
import { OrderEntity } from '../repository/postgres/entities/order.entity';
import {
  FilmEntity,
  FilmSession,
} from '../repository/postgres/entities/film.entity';
import { AppConfig } from 'src/app.config.provider';
import { DataSource } from 'typeorm';

@Global()
@Module({})
export class PostgresDatabaseModule {
  static create(): DynamicModule {
    const imports = [
      AppConfigModule,
      TypeOrmModule.forRootAsync({
        imports: [AppConfigModule],
        useFactory: (config: AppConfig): TypeOrmModuleOptions => ({
          type: 'postgres',
          host: config.database.url || 'localhost',
          port: parseInt(config.database.port || '5432', 10),
          username: config.database.username,
          password: config.database.password,
          database: config.database.database_name,
          entities: [OrderEntity, FilmEntity, FilmSession],
          synchronize: true,
        }),
        inject: ['CONFIG'],
      }),
      TypeOrmModule.forFeature([OrderEntity, FilmEntity, FilmSession]),
    ];

    const providers: Provider[] = [
      {
        provide: DatabaseService,
        useFactory: (config: AppConfig, dataSource: DataSource) => {
          return new DatabaseService(config, undefined, dataSource);
        },
        inject: ['CONFIG', getDataSourceToken()],
      },
      {
        provide: ORDER_REPOSITORY_TOKEN,
        useClass: OrderPostgresRepository,
      },
      {
        provide: FILM_REPOSITORY_TOKEN,
        useClass: FilmPostgresRepository,
      },
    ];

    return {
      module: PostgresDatabaseModule,
      imports,
      providers,
      exports: [DatabaseService, ORDER_REPOSITORY_TOKEN, FILM_REPOSITORY_TOKEN],
    };
  }
}
