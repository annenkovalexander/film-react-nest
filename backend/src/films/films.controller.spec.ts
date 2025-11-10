import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from './films.controller';
import { FilmsService } from './films.service';

const mockFilmsService = {
  findAll: jest.fn(),
  getSchedule: jest.fn(),
  getFilmsSessions: jest.fn(),
  getSession: jest.fn(),
  getOccupatedSeats: jest.fn(),
  findById: jest.fn(),
  getSessionByTickets: jest.fn()
}

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

describe('FilmController', () => {
  let controller: FilmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmController],
      providers: [{ provide: FilmsService, useValue: mockFilmsService }, { provide: 'APP_LOGGER', useValue: mockLogger }]
    }).compile();

    controller = module.get<FilmController>(FilmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
