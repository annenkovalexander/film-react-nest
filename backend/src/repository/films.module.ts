import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema, Film } from './films.schema';
import { FilmsService } from 'src/films/films.service';
import { FilmController } from 'src/films/films.controller';
import { FilmsRepository } from './filmsRepositioryInMongoDB';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [FilmsService, FilmsRepository],
  controllers: [FilmController],
  exports: [FilmsService],
})
export class FilmModule {}
