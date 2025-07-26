import { Controller, Get, Injectable, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponse, ScheduleResponse } from './dto/films.dto';

@Injectable()
@Controller('films')
export class FilmController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get()
  async findAll(): Promise<FilmsResponse> {
    return {
      total: 81692856.64964156,
      items: await this.filmsService.findAll(),
    };
  }
  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<ScheduleResponse> {
    return {
      total: 81692856.64964156,
      items: await this.filmsService.getSchedule(id),
    };
  }
}
