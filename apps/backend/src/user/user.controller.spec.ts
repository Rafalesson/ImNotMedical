import { UserController } from './user.controller';

describe('UserController', () => {
  it('should be defined', () => {
    const controller = new UserController({} as any);
    expect(controller).toBeDefined();
  });
});
