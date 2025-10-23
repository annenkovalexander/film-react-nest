// postgres-database.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IDatabaseService } from './database.provider';

@Injectable()
export class PostgresDatabaseService implements IDatabaseService {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  async listDatabases(): Promise<any> {
    const result = await this.dataSource.query(
      'SELECT datname FROM pg_database',
    );
    return result;
  }
}
