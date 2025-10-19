import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER'),
      url: configService.get<string>('DATABASE_URL'),
      database_name: configService.get<string>('DATABASE_NAME'),
      films_collection: configService.get<string>('FILMS_COLLECTION'),
      orders_collection: configService.get<string>('ORDERS_COLLECTION'),
    },
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  database_name: string;
  films_collection: string;
  orders_collection: string;
}
