import { CidsController } from './cids.controller';

describe('CidsController', () => {
  it('should be defined', () => {
    const controller = new CidsController({} as any);
    expect(controller).toBeDefined();
  });
});
