// scripts/migrate-direct.ts
import { MongoClient } from 'mongodb';
import { DataSource } from 'typeorm';
import {
  FilmEntity,
  FilmSession,
} from '../src/repository/postgres/entities/film.entity';
import { OrderEntity } from '../src/repository/postgres/entities/order.entity';

async function migrateDirect() {
  console.log('🚀 Starting direct migration...');

  // Подключение к MongoDB
  const mongoClient = new MongoClient('mongodb://iMac-Alexander.local:27017');
  await mongoClient.connect();

  // Подключение к PostgreSQL
  const dataSource = new DataSource({
    type: 'postgres',
    host: '62.84.122.184',
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'Film',
    entities: [FilmEntity, FilmSession, OrderEntity], // Добавили FilmSession
    synchronize: false,
    logging: true,
  });

  await dataSource.initialize();

  try {
    const mongoDb = mongoClient.db('Film');

    console.log('📦 Migrating films...');
    const filmsCollection = mongoDb.collection('film_collection');
    const films = await filmsCollection.find({}).toArray();

    const filmRepository = dataSource.getRepository(FilmEntity);
    const sessionRepository = dataSource.getRepository(FilmSession);

    for (const film of films) {
      console.log(`Migrating film: ${film.title}`);

      // Создаем фильм без сеансов
      const filmEntity = filmRepository.create({
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags,
        image: film.image,
        cover: film.cover,
        title: film.title,
        about: film.about,
        description: film.description,
        // Убрали schedule - сеансы будут в отдельной таблице
      });

      await filmRepository.save(filmEntity);

      // Мигрируем сеансы в отдельную таблицу
      if (film.schedule && film.schedule.length > 0) {
        console.log(
          `  Migrating ${film.schedule.length} sessions for film ${film.title}`,
        );

        const sessionEntities = film.schedule.map((session) => {
          return sessionRepository.create({
            id: session.id,
            daytime: new Date(session.daytime),
            hall: session.hall,
            rows: session.rows,
            seats: session.seats,
            price: session.price,
            taken: session.taken || [],
            film: filmEntity, // Связь с фильмом
          });
        });

        await sessionRepository.save(sessionEntities);
        console.log(`  ✅ Migrated ${sessionEntities.length} sessions`);
      }
    }

    console.log(`✅ Migrated ${films.length} films`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoClient.close();
    await dataSource.destroy();
  }
}

migrateDirect().catch(console.error);
