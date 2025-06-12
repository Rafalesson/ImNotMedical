export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: 'DOCTOR' | 'PATIENT'; // Só aceita esses dois valores
  crm?: string; // Opcional, para médicos
}