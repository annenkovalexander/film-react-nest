import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/filmsRepositioryInMongoDB';
import { Film, FilmSchedule } from 'src/repository/films.schema';
import { FilmDocument } from 'src/repository/films.schema';
import { Ticket } from 'src/repository/orders.schema';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async findAll(): Promise<Film[]> {
    return this.filmsRepository.findAll();
  }

  async getSchedule(id: string): Promise<FilmSchedule[] | []> {
    return this.filmsRepository.getFilmSchedule(id);
  }

  async getSession(tickets: Ticket[]): Promise<FilmSchedule | undefined> {
    const sessionId = tickets && tickets.length ? tickets[0].session : '';
    const session = await this.filmsRepository.findBySessionId(sessionId);
    return session;
  }

  async getOccupatedSeats(tickets: Ticket[]): Promise<string[] | []> {
    const session = await this.getSession(tickets);
    const taken = session.taken;
    return taken;
  }

  async setOccupatedSeats(tickets: Ticket[]): Promise<FilmDocument | []> {
    const session = await this.getSession(tickets);
    const filmDocument = await this.filmsRepository.updateScheduleTaken(
      session,
      tickets,
    );
    return filmDocument;
  }
}
