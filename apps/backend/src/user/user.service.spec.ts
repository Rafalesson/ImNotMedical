import { UserService } from './user.service';

describe('UserService', () => {
  it('should be defined', () => {
    const service = new UserService({} as any);
    expect(service).toBeDefined();
  });
});
