import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

const mockOrderService = {
  createOrder: jest.fn()
}

const mockLogger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService, { provide: OrderService, useValue: mockOrderService }, { provide: 'APP_LOGGER', useValue: mockLogger }]
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
