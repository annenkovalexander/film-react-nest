import { Injectable } from '@nestjs/common';
import { FilmsInMemoryRepository } from 'src/repository/filmsRepositioryInMemory';
import { Film, FilmSchedule } from 'src/repository/entities/films';

type FilmsResult = {
    total: number,
    items: Film[]
}

type FilmScheduleResult = {
    total: number;
    items: FilmSchedule
}

@Injectable()
export class FilmsService {
    constructor(private readonly filmsRepository: FilmsInMemoryRepository) {}
    findAll():FilmsResult {
        return this.filmsRepository.findAll();
    }
    getSchedule(id: string): FilmScheduleResult {
        return {
            total: 81692856.64964156,
            items: this.filmsRepository.getFilmSchedule(id)
        }
    }
}

