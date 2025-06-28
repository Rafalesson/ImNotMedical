// Endereço: apps/frontend/src/components/templates/modern/index.tsx (Sincronizado)
'use client';

import { useContext } from 'react'; 
import { AuthContext } from '@/contexts/AuthProvider';
import { useAttestation } from '@/contexts/AttestationContext';
import styles from './style.module.css';

export function ModernTemplate() {
  const { data: attestationData } = useAttestation();
  const { user } = useContext(AuthContext); 

  if (!attestationData || !attestationData.patient || !user || !user.doctorProfile) {
    return <div className="p-8 text-center text-red-600">Faltam dados para gerar o preview.</div>;
  }

  const { patient, purpose, durationInDays, cid } = attestationData;
  const { name: doctorName, crm: doctorCrm, specialty } = user.doctorProfile;
  const startDate = new Date().toLocaleDateString('pt-BR');
  const issueDateTime = new Date().toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* Usamos a imagem de assinatura PNG aqui como logo */}
          <img src="/signature.png" alt="Assinatura Digital Qualificada" className={styles.signatureMark} />
        </div>
        <div className={styles.doctorInfo}>
          <p className={styles.doctorName}>{doctorName}</p>
          <p className={styles.doctorSpec}>{specialty || 'Clínico Geral'}</p>
          <p className={styles.doctorCrm}>CRM {doctorCrm}</p>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.mainTitle}>Atestado Médico</h1>
        <p className={styles.mainText}>
          Atesto, para os devidos fins, que o(a) paciente <strong>{patient.name}</strong> portador(a) do CPF nº <strong>{patient.cpf}</strong> necessita de <strong>{durationInDays} dia(s)</strong> de afastamento de suas atividades
          a partir de <strong>{startDate}</strong>, por motivos de saúde.
        </p>
        <div className={styles.details}>
          <div className={styles.detailItem}><span>Finalidade</span><p>{purpose}</p></div>
          {cid && <div className={styles.detailItem}><span>CID-10</span><p>{cid.code} - {cid.description}</p></div>}
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerDetails}>
          <p>Emitido em: <strong>{issueDateTime}</strong></p>
          <p>Documento assinado digitalmente por <strong>{doctorName}</strong></p>
          <p>A validade deste documento pode ser verificada em www.validadordedocs.com.br</p>
          <p>Código de Validação: <strong>PRÉ-VISUALIZAÇÃO</strong></p>
        </div>
        <div className={styles.signatureImages}>
          <img src="/assinatura_img.jpeg" alt="Selo ICP Brasil" className={styles.icpSeal} />
        </div>
      </footer>
    </div>
  );
}