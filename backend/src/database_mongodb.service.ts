import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IDatabaseService } from './database.provider';
import { ListDatabasesResult } from 'typeorm';

@Injectable()
export class MongoDatabaseService implements IDatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async listDatabases(): Promise<ListDatabasesResult> {
    const adminDb = this.connection.db.admin();
    return adminDb.listDatabases();
  }
}
