import { PatientService } from './patient.service';

describe('PatientService', () => {
  it('should be defined', () => {
    const service = new PatientService({} as any);
    expect(service).toBeDefined();
  });
});
