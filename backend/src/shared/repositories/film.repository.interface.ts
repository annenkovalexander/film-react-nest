// shared/repositories/film.repository.interface.ts
import { IFilm, ISession } from '../entities/film.interface';
import { ITicket } from '../entities/order.interface';

export interface IFilmRepository {
  // Основные методы
  findAll(): Promise<IFilm[]>;
  findById(id: string): Promise<IFilm | null>;
  create(film: IFilm): Promise<IFilm>;
  update(id: string, film: Partial<IFilm>): Promise<IFilm | null>;

  // Методы для работы с сеансами и местами
  getOccupatedSeats(tickets: ITicket[]): Promise<string[]>;
  setOccupatedSeats(tickets: ITicket[]): Promise<boolean>;

  // Дополнительные методы
  findBySessionId(sessionId: string): Promise<ISession | null>;
  getFilmSessions(filmId: string): Promise<ISession[]>;
  updateSessionOccupiedSeats(
    sessionId: string,
    tickets: ITicket[],
  ): Promise<IFilm | null>;
  // Диагностические методы (опционально)
  debugFindAll?(): Promise<any>;
  checkConnection?(): Promise<void>;
  quickDebug?(): Promise<void>;
}
