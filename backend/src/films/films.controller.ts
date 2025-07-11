import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Injectable()
@Controller('films')
export class FilmController {
    constructor (private readonly filmsService: FilmsService) {}
    @Get()
    findAll() {
        console.log('films: ', this.filmsService.findAll());
        return this.filmsService.findAll();
    }
    @Get(':id/schedule')
    getSchedule(@Param('id') id: string) {
        return this.filmsService.getSchedule(id);
    }
}
