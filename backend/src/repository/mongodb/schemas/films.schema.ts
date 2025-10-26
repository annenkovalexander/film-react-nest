import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FilmScheduleDocument = FilmSchedule & Document;

@Schema()
export class FilmSchedule {
  @Prop({
    required: true,
    validate: {
      validator: (v: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v,
        ),
      message: (props: any) => `${props.value} это не UUID!`,
    },
  })
  id: string;
  @Prop({
    required: true,
    type: Date,
    validate: {
      validator: (v: any) => !isNaN(Date.parse(v)),
      message: (props: any) => `${props.value} не является датой!`,
    },
  })
  daytime: Date;
  @Prop({
    required: true,
  })
  hall: number;
  @Prop({
    required: true,
  })
  rows: number;
  @Prop({
    required: true,
  })
  seats: number;
  @Prop({
    required: true,
  })
  price: number;
  @Prop({
    required: true,
  })
  taken: string[];
}

export const FilmScheduleSchema = SchemaFactory.createForClass(FilmSchedule);

@Schema({ timestamps: true })
export class Film {
  @Prop({
    required: true,
    validate: {
      validator: (v: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          v,
        ),
      message: (props) => `${props.value} это не UUID!`,
    },
  })
  id: string;
  @Prop({
    required: true,
  })
  rating: number;
  @Prop({
    required: true,
  })
  director: string;
  @Prop({
    type: [String],
    required: true,
    default: [],
    validate: {
      validator: (v: string[]) =>
        v.every((item: any) => typeof item === 'string'),
      message: 'Каждый элемент массива должен быть непустой строкой',
    },
  })
  tags: string[];
  @Prop({
    required: true,
  })
  image: string;
  @Prop({
    required: true,
  })
  cover: string;
  @Prop({
    required: true,
  })
  title: string;
  @Prop({
    required: true,
  })
  about: string;
  @Prop({
    required: true,
  })
  description: string;
  @Prop({
    type: [FilmScheduleSchema],
    required: true,
    default: [],
  })
  schedule: FilmSchedule[];
}

export type FilmDocument = Film &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

export const FilmSchema = SchemaFactory.createForClass(Film);
