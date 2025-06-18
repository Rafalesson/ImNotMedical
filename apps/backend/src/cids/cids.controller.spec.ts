import { Test, TestingModule } from '@nestjs/testing';
import { CidsController } from './cids.controller';

describe('CidsController', () => {
  let controller: CidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CidsController],
    }).compile();

    controller = module.get<CidsController>(CidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
