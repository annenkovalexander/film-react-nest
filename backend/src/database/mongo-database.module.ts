// database/mongo-database.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { AppConfigModule } from '../app.config.module';
import { DatabaseService } from '../database.service';
import { OrderMongoRepository } from '../repository/mongodb/order.repository';
import { FilmMongoRepository } from '../repository/mongodb/film.repository';
import {
  Order,
  OrderSchema,
} from '../repository/mongodb/schemas/orders.schema';
import { Film, FilmSchema } from '../repository/mongodb/schemas/films.schema';
import { AppConfig } from 'src/app.config.provider';
import { Connection } from 'mongoose';

@Global() // ← ДОЛЖЕН БЫТЬ @Global()
@Module({})
export class MongoDatabaseModule {
  static create(): DynamicModule {
    const imports = [
      AppConfigModule,
      MongooseModule.forRootAsync({
        imports: [AppConfigModule],
        useFactory: (config: AppConfig) => ({
          uri: config.database.url + '/' + config.database.database_name,
        }),
        inject: ['CONFIG'],
      }),
      MongooseModule.forFeatureAsync([
        {
          name: Film.name,
          useFactory: (config: AppConfig) => {
            const schema = FilmSchema;
            schema.set(
              'collection',
              config.database.films_collection || 'films',
            );
            return schema;
          },
          inject: ['CONFIG'],
        },
        {
          name: Order.name,
          useFactory: (config: AppConfig) => {
            const schema = OrderSchema;
            schema.set(
              'collection',
              config.database.orders_collection || 'orders',
            );
            return schema;
          },
          inject: ['CONFIG'],
        },
      ]),
    ];

    const providers: Provider[] = [
      {
        provide: DatabaseService,
        useFactory: (config: AppConfig, mongooseConnection: Connection) => {
          return new DatabaseService(config, mongooseConnection, undefined);
        },
        inject: ['CONFIG', getConnectionToken()],
      },
      {
        provide: 'ORDER_REPOSITORY_TOKEN',
        useClass: OrderMongoRepository,
      },
      {
        provide: 'FILM_REPOSITORY_TOKEN',
        useClass: FilmMongoRepository,
      },
    ];

    return {
      module: MongoDatabaseModule,
      imports,
      providers,
      exports: [
        DatabaseService,
        'ORDER_REPOSITORY_TOKEN', // ← ДОЛЖНЫ ЭКСПОРТИРОВАТЬСЯ
        'FILM_REPOSITORY_TOKEN',
      ],
    };
  }
}
