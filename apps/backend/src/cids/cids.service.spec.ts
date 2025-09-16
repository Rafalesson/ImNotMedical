import { CidsService } from './cids.service';

describe('CidsService', () => {
  it('should be defined', () => {
    const service = new CidsService({} as any);
    expect(service).toBeDefined();
  });
});
