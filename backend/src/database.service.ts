import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.connection.on('connected', () => {
      console.log('MongoDB успешно подключен (событие connected)');
    });

    this.connection.on('error', (err) => {
      console.error('Ошибка подключения к MongoDB:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('MongoDB отключен (событие disconnected)');
    });

    if (this.connection.readyState === 1) {
      console.log('MongoDB уже подключен (readyState = 1) при инициализации DatabaseService');
    }
  }
}
