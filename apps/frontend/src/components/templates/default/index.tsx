// Endereço: apps/frontend/src/components/templates/default/index.tsx
'use-client';

import { useContext } from 'react'; 
import { AuthContext } from '@/contexts/AuthProvider';
import { useAttestation } from '@/contexts/AttestationContext';
import styles from './style.module.css';
import { calculateAge } from '@/utils/date';
import Image from 'next/image';

export function DefaultTemplate() {
  const { data: attestationData } = useAttestation();
  const { user } = useContext(AuthContext); 

  if (!attestationData || !attestationData.patient || !user || !user.doctorProfile) {
    return <div className="p-8 text-center text-red-600">Faltam dados para gerar o preview.</div>;
  }

  const { patient, purpose, durationInDays, cid } = attestationData;
  const { name: doctorName, crm: doctorCrm, specialty, address, phone } = user.doctorProfile;
  
  // MODIFICAÇÃO: Adicionada verificação para evitar passar 'undefined' para a função
  const patientAge = patient.patientProfile?.dateOfBirth 
    ? calculateAge(patient.patientProfile.dateOfBirth) 
    : 'N/A';

  const getDisplaySex = (sex: 'MALE' | 'FEMALE' | 'OTHER' | null | undefined) => {
    if (!sex) return 'Não informado';
    switch (sex) {
      case 'MALE':
        return 'Masculino';
      case 'FEMALE':
        return 'Feminino';
      default:
        return 'Outro';
    }
  };

  const patientSex = getDisplaySex(patient.patientProfile?.sex);
  
  const formattedDoctorAddress = address 
    ? `${address.street}, ${address.number} - ${address.city}, ${address.state}` 
    : 'Endereço não informado';
    
  const issueDateTime = new Date().toLocaleString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const previewCertificateCode = 'PRE-VISUALIZACAO';
  const envBaseUrlRaw = process.env.NEXT_PUBLIC_APP_URL || '';
  const envBaseUrl = envBaseUrlRaw.endsWith('/') ? envBaseUrlRaw.slice(0, -1) : envBaseUrlRaw;
  let runtimeBaseUrl = envBaseUrl;

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    runtimeBaseUrl = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  }

  const validationUrl = `${runtimeBaseUrl || ''}/validar/${previewCertificateCode}`;

  const startDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className={styles.certificateBody}>
      <header className={styles.header}>
        <h2 className={styles.doctorName}>{doctorName}</h2>
        <p className={styles.doctorDetails}>{specialty || 'Clínico Geral'} | CRM {doctorCrm}</p>
        <p className={styles.doctorDetails}>{formattedDoctorAddress} | {phone}</p>
      </header>
      <main>
        <section className={styles.title}>
          <h1 className={styles.titleText}>ATESTADO MÉDICO</h1>
        </section>
        <section className={styles.patientInfo}>
          <div className={styles.patientDetailGroup}>
            <span><strong>Paciente:</strong> {patient.name}</span>
            <span><strong>CPF:</strong> {patient.cpf}</span>
          </div>
          <div className={styles.patientDetailGroup}>
            <span><strong>Idade:</strong> {patientAge} anos</span>
            <span><strong>Sexo:</strong> {patientSex}</span>
          </div>
        </section>
        <section className={styles.content}>
          <p>
            Atesto, para os devidos fins, que o(a) paciente
            <strong> {patient.name}</strong>, portador(a) do CPF nº
            <strong> {patient.cpf}</strong>, esteve sob meus cuidados
            profissionais na presente data, necessitando de
            <strong> {durationInDays} ({'um'}) dia(s)</strong> de
            afastamento de suas atividades laborais/outras, a partir de
            <strong> {startDate}</strong>.
          </p>
          <p><strong>Finalidade:</strong> {purpose}</p>
          {cid && <p><strong>CID-10:</strong> {cid.code} - {cid.description}</p>}
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          <p>Emitido em {issueDateTime}</p>
          <p id={styles.footerP2}>
            Atendimento realizado via telemedicina, conforme MP nº 2.200-2/2001,
            <br />
            Resolução Nº CFM 2.299/2021, Resolução CFM Nº 2.381/2024 e Resolução
            CFM Nº 2.382/2024.
          </p>
          <p>
            Documento assinado digitalmente por {doctorName} <br />
            A validade deste documento pode ser verificada atraves do QR Code abaixo ou acessando {validationUrl} <br />
            Código de validação do documento: <strong>PRÉ-VISUALIZAÇÃO</strong>
          </p>
        </div>
        <div className={styles.containerImg}>
          <Image
            src="/assinatura_img.jpeg"
            alt="Imagem da assinatura eletronica"
            width={200}
            height={60}
            className={styles.icpImg}
          />
        </div>
      </footer>
    </div>
  );
}
