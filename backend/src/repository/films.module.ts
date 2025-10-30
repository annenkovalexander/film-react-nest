// repository/films.module.ts
import { Module } from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { FilmController } from '../films/films.controller';

@Module({
  providers: [FilmsService],
  controllers: [FilmController],
  exports: [FilmsService],
})
export class FilmModule {}
