import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema, Film } from './films.schema';
import { FilmsService } from 'src/films/films.service';
import { FilmController } from 'src/films/films.controller';
import { FilmsRepository } from './filmsRepositioryInMongoDB';
import { AppConfig, configProvider } from 'src/app.config.provider';
import { AppConfigModule } from 'src/app.config.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        imports: [AppConfigModule],
        name: Film.name,
        useFactory: (config: AppConfig) => {
          const collectionName = config.database.films_collection;
          return FilmSchema.set('collection', collectionName);
        },
        inject: ['CONFIG'] 
      }]),
  ],
  providers: [FilmsService, FilmsRepository, configProvider],
  controllers: [FilmController],
  exports: [FilmsService],
})
export class FilmModule {}
