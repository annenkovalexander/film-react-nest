import { Injectable } from '@nestjs/common';
import { Film, FilmDocument, FilmSchedule } from './films.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './orders.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film | undefined> {
    const foundFilm = this.filmModel.findOne({ id }).exec();
    return foundFilm;
  }

  async findBySessionId(id: string): Promise<FilmSchedule | undefined> {
    const film = this.filmModel
      .findOne({ 'schedule.id': id }, { 'schedule.$': 1 })
      .exec();
    const session = (await film).schedule[0];
    return session;
  }

  async getFilmSchedule(id: string): Promise<FilmSchedule[] | []> {
    const foundFilm = await this.findById(id);
    const filmSchedule = foundFilm.schedule;
    return filmSchedule;
  }

  async updateScheduleTaken(
    session: FilmSchedule,
    tickets: Ticket[],
  ): Promise<FilmDocument | undefined> {
    const taken = session.taken.concat(
      tickets.map((ticket: Ticket) => {
        return `${ticket.row}:${ticket.seat}`;
      }),
    );
    return this.filmModel
      .findOneAndUpdate(
        { 'schedule.id': session.id },
        { $set: { 'schedule.$.taken': taken } },
        { new: true },
      )
      .exec();
  }
}
