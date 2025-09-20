// Endereço: apps/frontend/src/components/templates/classic/index.tsx
'use client';

import { useContext } from 'react'; 
import { AuthContext } from '@/contexts/AuthProvider';
import { useAttestation } from '@/contexts/AttestationContext';
import styles from './style.module.css';
import Image from 'next/image';

export function ClassicTemplate() {
  const { data: attestationData } = useAttestation();
  const { user } = useContext(AuthContext); 

  if (!attestationData || !attestationData.patient || !user || !user.doctorProfile) {
    return <div className="p-8 text-center text-red-600">Faltam dados para gerar o preview.</div>;
  }

  const { patient, purpose, durationInDays, cid } = attestationData;
  const { name: doctorName, crm: doctorCrm, specialty } = user.doctorProfile;
  const startDate = new Date().toLocaleDateString('pt-BR');
  const issueDateTime = new Date().toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

  const previewCertificateCode = 'PRE-VISUALIZACAO';
  const envBaseUrlRaw = process.env.NEXT_PUBLIC_APP_URL || '';
  const envBaseUrl = envBaseUrlRaw.endsWith('/') ? envBaseUrlRaw.slice(0, -1) : envBaseUrlRaw;
  let runtimeBaseUrl = envBaseUrl;

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    runtimeBaseUrl = origin.endsWith('/') ? origin.slice(0, -1) : origin;
  }

  const validationUrl = `${runtimeBaseUrl || ''}/validar/${previewCertificateCode}`;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.doctorName}>Dr(a). {doctorName}</p>
        <p className={styles.doctorDetails}>{specialty || 'Clínico Geral'}</p>
        <p className={styles.doctorDetails}>CRM {doctorCrm}</p>
      </header>

      <h1 className={styles.mainTitle}>ATESTADO MÉDICO</h1>

      <main className={styles.mainContent}>
        <p>
          Atesto, para os devidos e legais fins, que o(a) paciente 
          <strong> {patient.name}</strong>, inscrito(a) no CPF sob o nº 
          <strong> {patient.cpf}</strong>, encontra-se sob meus cuidados 
          profissionais, sendo-lhe necessário o afastamento de suas atividades 
          habituais por um período de <strong> {durationInDays} ({'um'})</strong> dia(s), 
          a contar de <strong>{startDate}</strong>.
        </p>
        <p className={styles.detailLine}><strong>Finalidade:</strong> {purpose}</p>
        {cid && <p className={styles.detailLine}>CID-10: {cid.code} - {cid.description}</p>}
      </main>

      <footer className={styles.footer}>
        <div>
          <p>Emitido em {issueDateTime}</p>
          <p className={styles.footerP2}>
            Atendimento realizado via telemedicina, conforme legislação vigente.
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
