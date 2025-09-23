// Smoke test: gera HTML de exemplo usando a classe compilada
const { TemplatesService } = require('../dist/templates/templates.service');

(async () => {
  const svc = new TemplatesService();

  const certificateData = {
    doctorName: 'Dr. Teste',
    doctorCrm: '12345',
    doctorSpecialty: 'Cardiologia',
    doctorAddress: 'Rua Exemplo, 100',
    doctorPhone: '(11) 99999-9999',
    patientName: 'Paciente Teste',
    patientCpf: '000.000.000-00',
    patientAge: '30',
    patientSex: 'M',
    durationInDays: 5,
    durationInWords: 'cinco dias',
    startDate: '2025-09-23',
    purpose: 'Descanso',
    cidCode: 'A00',
    cidDescription: 'Exemplo',
    issueDateTime: '', // teste vazio -> deve usar agora (Brasília)
    certificateId: 'cert-123',
  };

  const prescriptionData = {
    doctorName: 'Dr. Receita',
    doctorCrm: '54321',
    doctorSpecialty: 'Clínico Geral',
    doctorAddress: 'Av Teste, 200',
    doctorPhone: '(21) 98888-8888',
    patientName: 'Paciente Receita',
    patientCpf: '111.111.111-11',
    issueDateTime: '',
    items: [
      { title: 'Medicamento A', description: '1x ao dia', observation: '' },
    ],
    generalGuidance: 'Tomar com água',
    additionalNotes: '',
    prescriptionCode: 'presc-123',
  };

  try {
    const certHtml = await svc.getPopulatedCertificateHtml(certificateData, 'default');
    console.log('--- CERT HTML SNIPPET ---');
    console.log(certHtml.substring(0, 1000));

    const presHtml = await svc.getPopulatedPrescriptionHtml(prescriptionData, 'default');
    console.log('--- PRES HTML SNIPPET ---');
    console.log(presHtml.substring(0, 1000));
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(1);
  }
})();