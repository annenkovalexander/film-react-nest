import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';

const mockFilmsRepository = {
  findAll: jest.fn(),
  getSchedule: jest.fn(),
  getFilmsSessions: jest.fn(),
  getSession: jest.fn(),
  getOccupatedSeats: jest.fn(),
  findById: jest.fn(),
  getSessionByTickets: jest.fn()
}

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

describe('FilmService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService, { provide: 'FILM_REPOSITORY_TOKEN', useValue: mockFilmsRepository }, { provide: 'APP_LOGGER', useValue: mockLogger }],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
