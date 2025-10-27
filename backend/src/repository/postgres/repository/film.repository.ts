// repository/postgres/film.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFilmRepository } from '../../../shared/repositories/film.repository.interface';
import { IFilm, ISession } from '../../../shared/entities/film.interface';
import { ITicket } from '../../../shared/entities/order.interface';
import { FilmEntity, FilmSession } from '../entities/film.entity';

@Injectable()
export class FilmPostgresRepository implements IFilmRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
  ) {}

  async findAll(): Promise<IFilm[]> {
    console.log('FilmPostgresRepository: searching for films...');
    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    console.log('FilmPostgresRepository: found', films.length, 'films');
    return films.map((film) => this.toDomain(film));
  }

  async debugFindAll(): Promise<IFilm[]> {
    console.log('=== DEBUG FilmPostgresRepository ===');

    const films = await this.filmRepository.find({
      relations: ['schedule'],
    });
    console.log('Total films in PostgreSQL:', films.length);

    if (films.length > 0) {
      console.log('First film:', {
        id: films[0].id,
        title: films[0].title,
        sessionsCount: films[0].schedule?.length || 0,
      });
    }

    console.log('=== END DEBUG ===');

    return this.findAll();
  }

  async findById(id: string): Promise<IFilm | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film ? this.toDomain(film) : null;
  }

  async getOccupatedSeats(tickets: ITicket[]): Promise<string[]> {
    if (!tickets.length) return [];

    const sessionId = tickets[0].sessionId;

    // Используем QueryBuilder для получения занятых мест
    const result = await this.filmRepository
      .createQueryBuilder('film')
      .select('session.taken', 'taken')
      .innerJoin('film.schedule', 'session')
      .where('session.id = :sessionId', { sessionId })
      .getRawOne();

    return result?.taken || [];
  }

  async setOccupatedSeats(tickets: ITicket[]): Promise<boolean> {
    if (!tickets.length) return false;

    const sessionId = tickets[0].sessionId;
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);

    try {
      // Находим фильм, содержащий нужный сеанс
      const film = await this.filmRepository
        .createQueryBuilder('film')
        .leftJoinAndSelect('film.schedule', 'session')
        .where('session.id = :sessionId', { sessionId })
        .getOne();

      if (!film || !film.schedule) {
        console.log('❌ Film or schedule not found');
        return false;
      }

      // Находим конкретный сеанс
      const session = film.schedule.find((s) => s.id === sessionId);
      if (!session) {
        console.log('❌ Session not found in film schedule');
        return false;
      }

      // Обновляем занятые места
      if (!session.taken) {
        session.taken = [];
      }

      // Добавляем новые места (исключая дубликаты)
      const newTakenSeats = takenSeats.filter(
        (seat) => !session.taken.includes(seat),
      );

      if (newTakenSeats.length === 0) {
        console.log('ℹ️ No new seats to add');
        return true;
      }

      session.taken.push(...newTakenSeats);

      // Сохраняем через QueryBuilder для обновления только нужных полей
      await this.filmRepository
        .createQueryBuilder()
        .update(FilmSession)
        .set({ taken: session.taken })
        .where('id = :sessionId', { sessionId })
        .execute();

      console.log('✅ Seats updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating seats:', error);
      return false;
    }
  }

  async create(film: IFilm): Promise<IFilm> {
    const filmEntity = this.filmRepository.create(film);
    const savedFilm = await this.filmRepository.save(filmEntity);
    return this.toDomain(savedFilm);
  }

  async update(id: string, film: Partial<IFilm>): Promise<IFilm | null> {
    await this.filmRepository.update(id, film);
    const updatedFilm = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return updatedFilm ? this.toDomain(updatedFilm) : null;
  }

  async findBySessionId(sessionId: string): Promise<ISession | null> {
    // Находим сеанс через фильм
    const film = await this.filmRepository
      .createQueryBuilder('film')
      .leftJoinAndSelect('film.schedule', 'session')
      .where('session.id = :sessionId', { sessionId })
      .getOne();

    const session = film?.schedule?.find((s) => s.id === sessionId);
    return session ? this.sessionToDomain(session) : null;
  }

  async getFilmSessions(filmId: string): Promise<ISession[]> {
    // Получаем сеансы через фильм
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedule'],
    });

    return (
      film?.schedule?.map((session) => this.sessionToDomain(session)) || []
    );
  }

  async updateSessionOccupiedSeats(
    sessionId: string,
    tickets: ITicket[],
  ): Promise<IFilm | null> {
    const takenSeats = tickets.map((ticket) => `${ticket.row}:${ticket.seat}`);

    try {
      // Находим фильм, содержащий нужный сеанс
      const film = await this.filmRepository
        .createQueryBuilder('film')
        .leftJoinAndSelect('film.schedule', 'session')
        .where('session.id = :sessionId', { sessionId })
        .getOne();

      if (!film || !film.schedule) {
        console.log('❌ Film or schedule not found');
        return null;
      }

      // Находим конкретный сеанс
      const session = film.schedule.find((s) => s.id === sessionId);
      if (!session) {
        console.log('❌ Session not found in film schedule');
        return null;
      }

      // Обновляем занятые места
      if (!session.taken) {
        session.taken = [];
      }

      // Добавляем новые места (исключая дубликаты)
      const newTakenSeats = takenSeats.filter(
        (seat) => !session.taken.includes(seat),
      );

      if (newTakenSeats.length > 0) {
        session.taken.push(...newTakenSeats);

        // Обновляем через QueryBuilder
        await this.filmRepository
          .createQueryBuilder()
          .update(FilmSession)
          .set({ taken: session.taken })
          .where('id = :sessionId', { sessionId })
          .execute();
      }

      console.log('✅ Session seats updated successfully');
      return this.toDomain(film);
    } catch (error) {
      console.error('❌ Error updating session occupied seats:', error);
      return null;
    }
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
      schedule: entity.schedule
        ? entity.schedule.map((s) => this.sessionToDomain(s))
        : [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private sessionToDomain(entity: FilmSession): ISession {
    return {
      id: entity.id,
      daytime: entity.daytime,
      hall: entity.hall,
      rows: entity.rows,
      seats: entity.seats,
      price: entity.price,
      taken: entity.taken || [],
    };
  }
}
