// database/postgres-database.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { DatabaseService } from '../database.service';
import {
  FILM_REPOSITORY_TOKEN,
  ORDER_REPOSITORY_TOKEN,
} from '../shared/di-tokens';
import { OrderPostgresRepository } from '../repository/postgres/repository/order.repository';
import { FilmPostgresRepository } from '../repository/postgres/repository/film.repository';
import { OrderEntity } from '../repository/postgres/entities/order.entity';
import { FilmEntity } from '../repository/postgres/entities/film.entity';
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
          entities: [OrderEntity, FilmEntity],
          synchronize: true,
        }),
        inject: ['CONFIG'],
      }),
      TypeOrmModule.forFeature([OrderEntity, FilmEntity]),
    ];

    const providers: Provider[] = [
      {
        provide: DatabaseService,
        useFactory: (config: AppConfig, dataSource: any) => {
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
