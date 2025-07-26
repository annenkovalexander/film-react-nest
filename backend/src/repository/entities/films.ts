export class Film {
  constructor(
    public readonly id: string,
    public rating: number,
    public director: string,
    public tags: string[],
    public title: string,
    public about: string,
    public description: string,
    public image: string,
    public cover: string,
  ) {}
}

export class FilmSchedule {
  constructor(
    public readonly id: string,
    public daytime: string,
    public hall: string,
    public rows: number,
    public seats: number,
    public price: number,
    public taken: string[],
  ) {}
}
