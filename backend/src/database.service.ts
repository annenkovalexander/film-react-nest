// database.service.ts
import { Injectable, Inject, Optional, LoggerService } from '@nestjs/common';
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
    @Optional() @Inject('APP_LOGGER') private readonly logger?: LoggerService
  ) {}

  async listDatabases(logger?: LoggerService): Promise<string[]> {
    const driver = this.config.database.driver?.toLowerCase();
    logger.log('Database driver:', driver);
    logger.log('Mongoose connection available:', !!this.mongooseConnection);
    logger.log('TypeORM connection available:', !!this.dataSource);

    try {
      if (driver === 'mongodb' && this.mongooseConnection) {
        const db = this.mongooseConnection.db;
        const adminDb = db.admin();
        const result = await adminDb.listDatabases();
        return result.databases.map(
          (db: { name: string; sizeOnDisk?: number; empty?: boolean }) =>
            db.name,
        );
      } else if (driver === 'postgres' && this.dataSource) {
        const result = await this.dataSource.query(`
          SELECT datname as name 
          FROM pg_database 
          WHERE datistemplate = false;
        `);
        return result.map((row: { name: string }) => row.name);
      } else {
        throw new Error(
          `Unsupported database driver: ${driver} or connection not available`,
        );
      }
    } catch (error) {
      this.logger.error('Error listing databases:', error);
      return [];
    }
  }
}
