//TODO описать DTO для запросов к /films
import { IsUUID } from 'class-validator';

export class FilmItemDto  {
    "id": string;
    "rating": number;
    "director": string;
    "tags": string[];
    "title": string;
    "about": string;
    "description": string;
    "image": string;
    "cover": string;
  }

export class FilmsDto {
  "total": number;
  "items": FilmItemDto[];
}

export class ScheduleItemDto {
    "daytime": string;
    "hall": string;
    "rows": number;
    "seats": number;
    "price": number;
    "taken": string[];
};

export class Schedule {
  "total": number;
  "items": ScheduleItemDto[]
}

export class FindOneParamsDto {
  @IsUUID()
  id: string;
}