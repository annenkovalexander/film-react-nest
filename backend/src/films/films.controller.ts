import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponse, ScheduleResponse } from './dto/films.dto';

@Injectable()
@Controller('films')
export class FilmController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  async findAll(): Promise<FilmsResponse> {
    const films = await this.filmsService.findAll();
    return {
      total: films.length,
      items: films,
    };
  }
  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<ScheduleResponse> {
    const schedule = await this.filmsService.getSchedule(id);
    return {
      total: schedule.length,
      items: schedule,
    };
  }
}
