import { PatientController } from './patient.controller';

describe('PatientController', () => {
  it('should be defined', () => {
    const controller = new PatientController({} as any);
    expect(controller).toBeDefined();
  });
});
