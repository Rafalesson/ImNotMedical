export interface PrescriptionItemData {
  title: string;
  description?: string | null;
  observation?: string | null;
}

export interface PrescriptionData {
  doctorName: string;
  doctorCrm: string;
  doctorSpecialty?: string | null;
  doctorAddress?: string | null;
  doctorPhone?: string | null;
  patientName: string;
  patientCpf: string;
  patientAge?: string | null;
  patientSex?: string | null;
  issueDateTime: string;
  items: PrescriptionItemData[];
  generalGuidance?: string | null;
  additionalNotes?: string | null;
  prescriptionCode: string;
  pharmacyToken?: string | null;
  patientToken?: string | null;
  qrCodeDataUrl?: string | null;
  signatureImage?: string | null;
}
