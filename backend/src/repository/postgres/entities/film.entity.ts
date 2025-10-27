// repository/postgres/entities/film.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IFilm, ISession } from '../../../shared/entities/film.interface';

@Entity('films')
export class FilmEntity implements IFilm {
  @PrimaryColumn()
  id: string;

  @Column('float')
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @OneToMany(() => FilmSession, (session) => session.film)
  schedule: FilmSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('session')
export class FilmSession implements ISession {
  @PrimaryColumn()
  id: string;

  @Column()
  daytime: Date;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column('text', { array: true })
  taken: string[];

  @ManyToOne(() => FilmEntity, (film) => film.schedule, {
    nullable: false,
  })
  @JoinColumn({ name: 'film_id' })
  film: FilmEntity;

  @Column({ name: 'film_id' })
  film_id: string;
}
