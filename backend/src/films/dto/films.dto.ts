//TODO описать DTO для запросов к /films
import { IsUUID } from 'class-validator';
import { Film, FilmSchedule } from 'src/repository/films.schema';

export class FilmsResponse {
  'total': number;
  'items': Film[];
}

export class ScheduleResponse {
  'total': number;
  'items': FilmSchedule[] | [];
}

export class FindOneParamsDto {
  @IsUUID()
  id: string;
}
