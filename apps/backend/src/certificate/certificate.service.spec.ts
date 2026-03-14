import { CertificateService } from './certificate.service';

describe('CertificateService', () => {
  let service: CertificateService;

  beforeEach(() => {
    service = new CertificateService(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should format date-time using Sao Paulo timezone', () => {
    const result = (service as any).formatDateToSaoPaulo(
      '2026-03-14T01:42:26.000Z',
    );

    expect(result).toBe('13/03/2026');
  });

  it('should keep yyyy-mm-dd date strings without timezone shift', () => {
    const result = (service as any).formatDateToSaoPaulo('2026-03-14');

    expect(result).toBe('14/03/2026');
  });

  it('should format cpf with dots and dash', () => {
    const result = (service as any).formatCpf('16757248735');

    expect(result).toBe('167.572.487-35');
  });

  it('should keep original cpf value when it is invalid length', () => {
    const result = (service as any).formatCpf('12345');

    expect(result).toBe('12345');
  });
});
