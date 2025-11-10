import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER'),
      url: configService.get<string>('DATABASE_URL'),
      port: configService.get<string>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database_name: configService.get<string>('DATABASE_NAME'),
      films_collection: configService.get<string>('FILMS_COLLECTION'),
      orders_collection: configService.get<string>('ORDERS_COLLECTION'),
    },
    logger: {
      env_type: configService.get<string>('NODE_ENV'),
    }
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
  logger: AppConfigLogger;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  port: string;
  username: string;
  password: string;
  database_name: string;
  films_collection: string;
  orders_collection: string;
}

export interface AppConfigLogger {
  env_type: string;
} 
