export interface IFilm {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ISession[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISession {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[]; // формат "row:seat"
}

export interface IPlace {
  row: number;
  seat: number;
}
