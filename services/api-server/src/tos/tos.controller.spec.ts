import { Test, TestingModule } from '@nestjs/testing';
import { TosController } from './tos.controller';

describe('TosController', () => {
  let controller: TosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TosController],
    }).compile();

    controller = module.get<TosController>(TosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
