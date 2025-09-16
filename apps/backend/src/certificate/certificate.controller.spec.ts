import { CertificateController } from './certificate.controller';

describe('CertificateController', () => {
  it('should be defined', () => {
    const controller = new CertificateController({} as any);
    expect(controller).toBeDefined();
  });
});
