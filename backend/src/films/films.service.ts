// films/films.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IFilmRepository } from '../shared/repositories/film.repository.interface';
import { IFilm, ISession } from '../shared/entities/film.interface';
import { ITicket } from '../shared/entities/order.interface';
import { FILM_REPOSITORY_TOKEN } from '../shared/di-tokens';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILM_REPOSITORY_TOKEN)
    private readonly filmsRepository: IFilmRepository,
  ) {}

  async findAll(): Promise<IFilm[]> {
    const films = await this.filmsRepository.debugFindAll();
    console.log('films:', films);
    return films;
  }

  async getSchedule(filmId: string): Promise<ISession[]> {
    return this.filmsRepository.getFilmSessions(filmId);
  }

  async getFilmSessions(filmId: string): Promise<ISession[]> {
    return this.filmsRepository.getFilmSessions(filmId);
  }

  async getSession(sessionId: string): Promise<ISession | null> {
    return this.filmsRepository.findBySessionId(sessionId);
  }

  async getOccupatedSeats(tickets: ITicket[]): Promise<string[]> {
    if (!tickets.length) return [];
    return this.filmsRepository.getOccupatedSeats(tickets);
  }

  async setOccupatedSeats(tickets: ITicket[]): Promise<boolean> {
    if (!tickets.length) return false;
    return this.filmsRepository.setOccupatedSeats(tickets);
  }

  async findById(id: string): Promise<IFilm | null> {
    return this.filmsRepository.findById(id);
  }

  // Метод для обратной совместимости с твоим кодом
  async getSessionByTickets(tickets: ITicket[]): Promise<ISession | null> {
    const sessionId = tickets && tickets.length ? tickets[0].sessionId : '';
    return this.getSession(sessionId);
  }
}
