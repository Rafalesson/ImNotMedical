// Endereço: apps/backend/prisma/seed.ts 
import { PrismaClient, Role } from '@prisma/client'; 
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt'; 
const prisma = new PrismaClient();

// Suas funções auxiliares permanecem as mesmas
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDescription(text: string): string {
  const trimmedText = text.trim();
  if (!trimmedText) return '';
  return trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1).toLowerCase();
}


async function main() {
  console.log('Iniciando o processo de seeding completo...');

  // ==========================================================
  // PARTE 1: LÓGICA EXISTENTE PARA POPULAR CID-10
  // ==========================================================
  await prisma.cidCode.deleteMany({});
  console.log('Tabela CidCode limpa com sucesso.');

  const cid10FilePath = path.join(__dirname, 'cid10.json');
  const cid10FileContent = fs.readFileSync(cid10FilePath, 'utf-8');
  const jsonData: any = JSON.parse(cid10FileContent);
  
  const cid10RawData: { code: string; display: string }[] = Array.isArray(jsonData)
    ? jsonData
    : jsonData.concept;

  if (!Array.isArray(cid10RawData)) {
    throw new Error('Não foi possível encontrar uma lista (array) de CIDs dentro do arquivo cid10.json.');
  }

  const cid10CleanData = cid10RawData.map(cid => ({
    code: cid.code,
    description: formatDescription(stripHtml(cid.display)), 
  }));

  console.log(`Lidos e limpos ${cid10CleanData.length} códigos. Iniciando inserção de CIDs...`);

  await prisma.cidCode.createMany({
    data: cid10CleanData,
    skipDuplicates: true,
  });

  console.log(`Seeding de CIDs finalizado! ${cid10CleanData.length} códigos foram adicionados.`);


  // ==========================================================
  // PARTE 2: NOVA LÓGICA PARA CRIAR USUÁRIOS DE TESTE
  // ==========================================================
  console.log('Iniciando criação de usuários de teste...');

  // Limpa usuários de teste antigos para evitar duplicidade
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['dr.barbara@zello.com', 'livia.santos@email.com'],
      },
    },
  });
  console.log('Usuários de teste antigos removidos.');


  const hashedPassword = await bcrypt.hash('12345678', 10);

  // --- CRIAÇÃO DO MÉDICO DE TESTE ---
  const doctor = await prisma.user.create({
    data: {
      email: 'dr.teste@zello.com',
      phone: '11999999999',
      password: hashedPassword,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          name: 'Dra. Teste da Silva',
          crm: '12345SP',
          specialty: 'Cardiologia',
          address: {
            create: {
              street: 'Av. Paulista',
              number: '1000',
              neighborhood: 'Bela Vista',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01310-100',
            },
          },
        },
      },
    },
  });
  console.log(`Médico de teste criado: ${doctor.email}`);

  // --- CRIAÇÃO DO PACIENTE DE TESTE ---
  const patient = await prisma.user.create({
    data: {
      email: 'paciente.teste@zello.com',
      phone: '21999999999',
      password: hashedPassword,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          name: 'Paciente Teste da Silva',
          cpf: '111.222.333-44',
          dateOfBirth: new Date('1990-05-15T00:00:00.000Z'),
        },
      },
    },
  });
  console.log(`Paciente de teste criado: ${patient.email}`);

  console.log('Seeding completo!');
}


main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });