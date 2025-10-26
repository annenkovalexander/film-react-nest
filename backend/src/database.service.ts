// database.service.ts
import { Injectable, Inject, Optional } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';
import { AppConfig } from './app.config.provider';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('CONFIG') private readonly config: AppConfig,
    @Optional()
    @InjectConnection()
    private readonly mongooseConnection?: Connection,
    @Optional() @InjectDataSource() private readonly dataSource?: DataSource,
  ) {}

  async listDatabases(): Promise<string[]> {
    const driver = this.config.database.driver?.toLowerCase();
    console.log('Database driver:', driver);
    console.log('Mongoose connection available:', !!this.mongooseConnection);
    console.log('TypeORM connection available:', !!this.dataSource);

    try {
      if (driver === 'mongodb' && this.mongooseConnection) {
        const db = this.mongooseConnection.db;
        const adminDb = db.admin();
        const result = await adminDb.listDatabases();
        return result.databases.map((db: any) => db.name);
      } else if (driver === 'postgres' && this.dataSource) {
        const result = await this.dataSource.query(`
          SELECT datname as name 
          FROM pg_database 
          WHERE datistemplate = false;
        `);
        return result.map((row: any) => row.name);
      } else {
        throw new Error(
          `Unsupported database driver: ${driver} or connection not available`,
        );
      }
    } catch (error) {
      console.error('Error listing databases:', error);
      return [];
    }
  }
}
