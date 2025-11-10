import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsService } from '../films/films.service';

const mockOrdersRepository = {
  createOrder: jest.fn(),
}

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

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, FilmsService, { provide: 'ORDER_REPOSITORY_TOKEN', useValue: mockOrdersRepository }, { provide: 'FILM_REPOSITORY_TOKEN', useValue: mockFilmsRepository }, { provide: 'APP_LOGGER', useValue: mockLogger }],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
