// repository/mongodb/film.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IFilmRepository } from '../../shared/repositories/film.repository.interface';
import { IFilm, ISession } from '../../shared/entities/film.interface';
import { ITicket } from '../../shared/entities/order.interface';
import { Film, FilmDocument } from './schemas/films.schema';

@Injectable()
export class FilmMongoRepository implements IFilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async checkConnection(): Promise<void> {
    try {
      const count = await this.filmModel.countDocuments();
      console.log(`Total films in collection: ${count}`);

      // Правильный способ - убрать toArray()
      const collectionsCursor = this.filmModel.db.listCollections();
      const collections = await collectionsCursor;
      console.log(
        'Available collections:',
        collections.map((c: any) => c.name),
      );
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  }

  async debugFindAll(): Promise<any> {
    console.log('=== DEBUG FilmMongoRepository ===');

    try {
      // 1. Проверим модель
      console.log('Model name:', this.filmModel.modelName);
      console.log('Collection name:', this.filmModel.collection.collectionName);

      // 2. Проверим базу данных
      const db = this.filmModel.db;
      console.log('Database name:', db);

      // 3. Получим список коллекций (исправлено)
      const collectionsCursor = db.listCollections();
      const collections = await collectionsCursor;
      console.log(
        'All collections:',
        collections.map((c: any) => c.name),
      );
      // 4. Проверим конкретные коллекции
      const targetCollections = [
        'film_collection',
        'films',
        'films_collection',
      ];
      for (const collName of targetCollections) {
        try {
          const coll = db.collection(collName);
          const count = await coll.countDocuments();
          console.log(`Collection "${collName}": ${count} documents`);

          if (count > 0) {
            const sample = await coll.findOne({});
            console.log(
              `Sample from "${collName}":`,
              JSON.stringify(sample, null, 2),
            );
          }
        } catch (e) {
          console.log(
            `Collection "${collName}" does not exist or error:`,
            e.message,
          );
        }
      }

      // 5. Проверим через модель
      const filmsCount = await this.filmModel.countDocuments();
      console.log('Documents through model:', filmsCount);

      if (filmsCount > 0) {
        const sampleFilm = await this.filmModel.findOne().exec();
        console.log(
          'Sample through model:',
          JSON.stringify(sampleFilm, null, 2),
        );
      }

      console.log('=== END DEBUG ===');
    } catch (error) {
      console.error('DEBUG error:', error);
    }

    return this.findAll();
  }

  async findAll(): Promise<IFilm[]> {
    console.log('FilmMongoRepository: searching for films...');
    try {
      const films = await this.filmModel.find().exec();
      console.log('FilmMongoRepository: found', films.length, 'films');
      const result = films.map((film) => this.toDomain(film));
      console.log('FilmMongoRepository: transformed result', result);
      return result;
    } catch (error) {
      console.error('FilmMongoRepository: error', error);
      return [];
    }
  }

  async findById(id: string): Promise<IFilm | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.toDomain(film) : null;
  }

  async getOccupatedSeats(tickets: ITicket[]): Promise<string[]> {
    if (!tickets.length) return [];

    const sessionId = tickets[0].sessionId;
    console.log('🎯 Looking for session:', sessionId);

    // Временно ищем только по sessionId без проверки filmId
    const session = await this.findBySessionId(sessionId);

    if (session) {
      console.log('✅ Session found:', session.id);
      return session.taken || [];
    } else {
      console.log('❌ Session not found');
      return [];
    }
  }

  async setOccupatedSeats(tickets: ITicket[]): Promise<boolean> {
    if (!tickets.length) return false;

    const sessionId = tickets[0].sessionId;
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);

    const result = await this.filmModel
      .updateOne(
        { 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': { $each: takenSeats } } },
      )
      .exec();

    return result.modifiedCount > 0;
  }

  async create(film: IFilm): Promise<IFilm> {
    const createdFilm = new this.filmModel(film);
    const savedFilm = await createdFilm.save();
    return this.toDomain(savedFilm);
  }

  async update(id: string, film: Partial<IFilm>): Promise<IFilm | null> {
    const updatedFilm = await this.filmModel
      .findOneAndUpdate({ id }, film, { new: true })
      .exec();
    return updatedFilm ? this.toDomain(updatedFilm) : null;
  }

  async findBySessionId(sessionId: string): Promise<ISession | null> {
    const film = await this.filmModel
      .findOne({ 'schedule.id': sessionId }, { 'schedule.$': 1 })
      .exec();

    return film?.schedule[0] ? this.sessionToDomain(film.schedule[0]) : null;
  }

  async getFilmSessions(filmId: string): Promise<ISession[]> {
    const film = await this.findById(filmId);
    return film?.schedule || [];
  }

  async updateSessionOccupiedSeats(
    sessionId: string,
    tickets: ITicket[],
  ): Promise<IFilm | null> {
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`); // ← Закрывающая скобка для map

    const updatedFilm = await this.filmModel
      .findOneAndUpdate(
        { 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': { $each: takenSeats } } },
        { new: true },
      )
      .exec();

    return updatedFilm ? this.toDomain(updatedFilm) : null;
  }
  private toDomain(document: FilmDocument): IFilm {
    return {
      id: document.id,
      rating: document.rating,
      director: document.director,
      tags: document.tags,
      image: document.image,
      cover: document.cover,
      title: document.title,
      about: document.about,
      description: document.description,
      schedule: document.schedule.map((session) =>
        this.sessionToDomain(session),
      ),
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  private sessionToDomain(session: any): ISession {
    return {
      id: session.id,
      daytime: session.daytime,
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken || [],
    };
  }
}
