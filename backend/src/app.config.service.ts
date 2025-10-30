import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject('CONFIG')
    private readonly config: {
      database: {
        url: string;
        driver: string;
        port: string;
        username: string;
        password: string;
        database_name: string;
        films_collection: string;
        orders_collection: string;
      };
    },
  ) {
    console.log('config: ', this.config);
  }
}
