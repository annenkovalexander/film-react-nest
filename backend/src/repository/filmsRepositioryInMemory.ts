import { Injectable, Param } from "@nestjs/common";
import { Film, FilmSchedule } from './entities/films'
import { FilmItemDto, FilmsDto, FindOneParamsDto } from "src/films/dto/films.dto";

@Injectable()
export class FilmsInMemoryRepository {
    private films: FilmItemDto[] = [
        {
          "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
          "rating": 2.9,
          "director": "Итан Райт",
          "tags": [
            "Документальный"
          ],
          "title": "Архитекторы общества",
          "about": "Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.",
          "description": "Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.",
          "image": "/bg1s.jpg",
          "cover": "/bg1c.jpg"
        },
        {
          "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
          "rating": 2.9,
          "director": "Итан Райт",
          "tags": [
            "Документальный"
          ],
          "title": "Архитекторы общества",
          "about": "Документальный фильм, исследующий влияние искусственного интеллекта на общество и этические, философские и социальные последствия технологии.",
          "description": "Документальный фильм Итана Райта исследует влияние технологий на современное общество, уделяя особое внимание роли искусственного интеллекта в формировании нашего будущего. Фильм исследует этические, философские и социальные последствия гонки технологий ИИ и поднимает вопрос: какой мир мы создаём для будущих поколений.",
          "image": "/bg1s.jpg",
          "cover": "/bg1c.jpg"
        }
      ];
    private schedule: FilmSchedule = [
        {
            "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "daytime": "2023-05-29T10:30:00.001Z",
            "hall": "2",
            "rows": 5,
            "seats": 10,
            "price": 350,
            "taken": [
                "1:2",
                "1:2"
            ]
        },
        {
            "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
            "daytime": "2023-05-29T10:30:00.001Z",
            "hall": "2",
            "rows": 5,
            "seats": 10,
            "price": 350,
            "taken": [
                "1:2",
                "1:2"
            ]
        }
    ]


    findAll(): FilmsDto {
        console.log('films in repository: ', this.films);
        return {
            total: 81692856.64964156,
            items: this.films
        }
    }

    findById(@Param() params: FindOneParamsDto): FilmItemDto | number {
        const foundFilm = this.films.find((item) => item.id === params.id);
        if (!foundFilm)
            return -1;
        else
            return foundFilm;
    }

    getFilmSchedule(@Param() params: FindOneParamsDto): FilmSchedule {
        console.log("getFilmSchedule id: ", params.id);
        const filmSchedule = this.schedule.filter((item) => item.id === params.id);
        return filmSchedule;
    }
}
