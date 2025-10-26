// repository/postgres/film.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFilmRepository } from '../../../shared/repositories/film.repository.interface';
import { IFilm, ISession } from '../../../shared/entities/film.interface';
import { ITicket } from '../../../shared/entities/order.interface';
import { FilmEntity } from '../entities/film.entity';

@Injectable()
export class FilmPostgresRepository implements IFilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
  ) {}

  async findAll(): Promise<IFilm[]> {
    console.log('FilmPostgresRepository: searching for films...');
    const films = await this.filmRepository.find();
    console.log('FilmPostgresRepository: found', films.length, 'films');
    return films.map((film) => this.toDomain(film));
  }

  async debugFindAll(): Promise<any> {
    console.log('=== DEBUG FilmPostgresRepository ===');

    const films = await this.filmRepository.find();
    console.log('Total films in PostgreSQL:', films.length);

    if (films.length > 0) {
      console.log('First film:', {
        id: films[0].id,
        title: films[0].title,
        scheduleCount: films[0].schedule.length,
      });
    }

    console.log('=== END DEBUG ===');

    return this.findAll();
  }

  async findById(id: string): Promise<IFilm | null> {
    const film = await this.filmRepository.findOne({ where: { id } });
    return film ? this.toDomain(film) : null;
  }

  async getOccupatedSeats(tickets: ITicket[]): Promise<string[]> {
    if (!tickets.length) return [];

    const sessionId = tickets[0].sessionId;

    // ИСПРАВЛЕННЫЙ ЗАПРОС - передаем корректный JSON
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .where('film.schedule @> :session', {
        session: JSON.stringify([{ id: sessionId }]),
      })
      .getOne();

    const session = film?.schedule.find((s) => s.id === sessionId);
    return session?.taken || [];
  }

  async setOccupatedSeats(tickets: ITicket[]): Promise<boolean> {
    if (!tickets.length) return false;

    const sessionId = tickets[0].sessionId;
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);

    // ИСПРАВЛЕННЫЙ ЗАПРОС - передаем корректный JSON
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .where('film.schedule @> :session', {
        session: JSON.stringify([{ id: sessionId }]),
      })
      .getOne();

    if (!film) return false;

    const sessionIndex = film.schedule.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return false;

    // Добавляем занятые места (убедитесь, что taken существует)
    if (!film.schedule[sessionIndex].taken) {
      film.schedule[sessionIndex].taken = [];
    }

    film.schedule[sessionIndex].taken.push(...takenSeats);
    await this.filmRepository.save(film);

    return true;
  }

  async create(film: IFilm): Promise<IFilm> {
    const filmEntity = this.filmRepository.create(film);
    const savedFilm = await this.filmRepository.save(filmEntity);
    return this.toDomain(savedFilm);
  }

  async update(id: string, film: Partial<IFilm>): Promise<IFilm | null> {
    await this.filmRepository.update(id, film);
    const updatedFilm = await this.filmRepository.findOne({ where: { id } });
    return updatedFilm ? this.toDomain(updatedFilm) : null;
  }

  async findBySessionId(sessionId: string): Promise<ISession | null> {
    // ИСПРАВЛЕННЫЙ ЗАПРОС - передаем корректный JSON
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .where('film.schedule @> :session', {
        session: JSON.stringify([{ id: sessionId }]),
      })
      .getOne();

    return film?.schedule.find((s) => s.id === sessionId) || null;
  }

  async getFilmSessions(filmId: string): Promise<ISession[]> {
    const film = await this.findById(filmId);
    return film?.schedule || [];
  }

  async updateSessionOccupiedSeats(
    sessionId: string,
    tickets: ITicket[],
  ): Promise<IFilm | null> {
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);

    // ИСПРАВЛЕННЫЙ ЗАПРОС - передаем корректный JSON
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .where('film.schedule @> :session', {
        session: JSON.stringify([{ id: sessionId }]),
      })
      .getOne();

    if (!film) return null;

    const sessionIndex = film.schedule.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) return null;

    // Добавляем занятые места (убедитесь, что taken существует)
    if (!film.schedule[sessionIndex].taken) {
      film.schedule[sessionIndex].taken = [];
    }

    film.schedule[sessionIndex].taken.push(...takenSeats);
    const updatedFilm = await this.filmRepository.save(film);

    return this.toDomain(updatedFilm);
  }

  private toDomain(entity: FilmEntity): IFilm {
    return {
      id: entity.id,
      rating: entity.rating,
      director: entity.director,
      tags: entity.tags,
      image: entity.image,
      cover: entity.cover,
      title: entity.title,
      about: entity.about,
      description: entity.description,
      schedule: entity.schedule,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
