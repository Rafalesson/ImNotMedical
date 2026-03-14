import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplatesService],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should render dynamic startDate and issueDateTime in modern template', async () => {
    const html = await service.getPopulatedCertificateHtml(
      {
        doctorName: 'Dr. Teste',
        doctorCrm: '12345',
        doctorSpecialty: 'Clínica Médica',
        doctorAddress: 'Rua A, 100 - Rio de Janeiro, RJ',
        doctorPhone: '(21) 99999-9999',
        patientName: 'Paciente Teste',
        patientCpf: '12345678900',
        patientAge: '30',
        patientSex: 'Masculino',
        durationInDays: 1,
        durationInWords: 'um',
        startDate: '13/03/2026',
        purpose: 'Repouso',
        cidCode: 'B34.9',
        cidDescription: 'Infecção viral não especificada',
        issueDateTime: '13/03/2026 - 22:42:26 (GMT-03)',
        certificateId: 'ABC12345',
      },
      'modern',
    );

    expect(html).toContain('a partir de <strong>13/03/2026</strong>');
    expect(html).toContain('Emitido em 13/03/2026 - 22:42:26 (GMT-03)');
    expect(html).not.toContain('14/03/2026 às 04:18:34');
  });
});
