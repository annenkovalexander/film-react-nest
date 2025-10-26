// scripts/migrate-direct.ts
import { MongoClient } from 'mongodb';
import { DataSource } from 'typeorm';
import { FilmEntity } from '../repository/postgres/entities/film.entity';
import { OrderEntity } from '../repository/postgres/entities/order.entity';

async function migrateDirect() {
  console.log('🚀 Starting direct migration...');

  // Подключение к MongoDB
  const mongoClient = new MongoClient('mongodb://localhost:27017');
  await mongoClient.connect();

  // Подключение к PostgreSQL
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'student',
    password: 'student',
    database: 'Film',
    entities: [FilmEntity, OrderEntity],
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

    for (const film of films) {
      console.log(`Migrating film: ${film.title}`);

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
        schedule: film.schedule.map((session) => ({
          id: session.id,
          daytime: new Date(session.daytime),
          hall: session.hall,
          rows: session.rows,
          seats: session.seats,
          price: session.price,
          taken: session.taken || [],
        })),
      });

      await filmRepository.save(filmEntity);
    }

    console.log(`✅ Migrated ${films.length} films`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoClient.close();
    await dataSource.destroy();
  }
}

migrateDirect();
