import { Test, TestingModule } from '@nestjs/testing';
import { TosService } from './tos.service';

describe('TosService', () => {
  let service: TosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TosService],
    }).compile();

    service = module.get<TosService>(TosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
