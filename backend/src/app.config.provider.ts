// import { ConfigModule } from '@nestjs/config';

const DATABASE_URL = process.env.DATABASE_URL;
console.log('DATABASE_URL: ', DATABASE_URL);

export const configProvider = {
  provide: 'CONFIG',
  useValue: <AppConfig>{
    //TODO прочесть переменнные среды
    database: {
      driver: process.env.DATABASE_DRIVER,
      url: process.env.DATABASE_URL
    },
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
