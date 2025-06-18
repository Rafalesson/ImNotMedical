import { Test, TestingModule } from '@nestjs/testing';
import { CidsService } from './cids.service';

describe('CidsService', () => {
  let service: CidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CidsService],
    }).compile();

    service = module.get<CidsService>(CidsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
