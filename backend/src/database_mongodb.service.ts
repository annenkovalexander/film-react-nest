import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IDatabaseService } from './database.provider';

@Injectable()
export class MongoDatabaseService implements IDatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async listDatabases(): Promise<any> {
    const adminDb = this.connection.db.admin();
    return adminDb.listDatabases();
  }
}
