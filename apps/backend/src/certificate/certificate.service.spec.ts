import { CertificateService } from './certificate.service';

describe('CertificateService', () => {
  it('should be defined', () => {
    const service = new CertificateService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    expect(service).toBeDefined();
  });
});
