// prisma/seed.ts (versão final que lê a propriedade 'display')
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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
  console.log('Iniciando o processo de seeding...');

  await prisma.cidCode.deleteMany({});
  console.log('Tabela CidCode limpa com sucesso.');

  const cid10FilePath = path.join(__dirname, 'cid10.json');
  const cid10FileContent = fs.readFileSync(cid10FilePath, 'utf-8');
  const jsonData: any = JSON.parse(cid10FileContent);
  
  const cid10RawData: { code: string; display: string }[] = Array.isArray(jsonData)
    ? jsonData
    : jsonData.concept; // Assumindo que a lista está na propriedade 'concept' do seu arquivo FHIR

  if (!Array.isArray(cid10RawData)) {
    throw new Error('Não foi possível encontrar uma lista (array) de CIDs dentro do arquivo cid10.json. Verifique se a propriedade "concept" existe.');
  }

  const cid10CleanData = cid10RawData.map(cid => ({
    code: cid.code,
    // AQUI ESTÁ A CORREÇÃO! Usamos 'cid.display' em vez de 'cid.description'
    description: formatDescription(stripHtml(cid.display)), 
  }));

  console.log(`Lidos e limpos ${cid10CleanData.length} códigos. Iniciando inserção...`);

  await prisma.cidCode.createMany({
    data: cid10CleanData,
    skipDuplicates: true,
  });

  console.log(`Seeding finalizado! ${cid10CleanData.length} códigos CID-10 foram adicionados ao banco de dados.`);
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });