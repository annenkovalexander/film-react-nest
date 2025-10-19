import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppConfigService {
  constructor(
    @Inject('CONFIG')
    private readonly config: { database: { url: string; driver: string } },
  ) {
    console.log('config: ', this.config);
  }
}
