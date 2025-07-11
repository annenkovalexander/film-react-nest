//TODO описать DTO для запросов к /films
export class getFilmData  {
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

export class getFilmSchedule {
    "id": string;
    "daytime": string;
    "hall": string;
    "rows": number;
    "seats": number;
    "price": number;
    "taken": string[];
}[];