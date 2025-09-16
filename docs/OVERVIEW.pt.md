# Vis?o Geral do Projeto

## Arquitetura Geral
- O reposit?rio segue o modelo **monorepo**, contendo duas aplica??es principais:
  - `apps/backend`: API desenvolvida em **NestJS**.
  - `apps/frontend`: interface desenvolvida em **Next.js**.
- Banco de dados relacional acessado via **Prisma** (**PostgreSQL** hospedado no Supabase).
- Gera??o de PDFs realizada remotamente (**Browserless + Puppeteer**) com armazenamento no **Cloudinary**.

---

## Backend (NestJS)

### Estrutura de M?dulos
- **auth**: autentica??o via JWT, fluxo de "esqueci/reset de senha", guards e decorators de roles.
- **certificate**: emiss?o, listagem, remo??o e valida??o de atestados m?dicos.
- **cids**: pesquisa de c?digos **CID-10**.
- **patient / user**: cadastro, consulta e contagem de pacientes/usu?rios.
- **mail**: envio de e-mails transacionais (ex.: reset de senha) via **Ethereal** em ambiente de desenvolvimento.
- **pdf / templates**: montagem de HTML com QRCode, gera??o de PDFs usando Browserless.
- **cloudinary**: servi?o para upload e remo??o de PDFs no armazenamento em nuvem.
- **prisma**: m?dulo global que exp?e `PrismaService` para os demais m?dulos.

### Fluxos Principais
1. **Login** (`POST /auth/login`): valida credenciais e gera JWT.
2. **Esqueci a senha** (`POST /auth/password/forgot`): cria token, registra validade e dispara e-mail com link.
3. **Reset de senha** (`POST /auth/password/reset`): valida token, compara confirma??o e atualiza a senha.
4. **Emiss?o de atestado** (`POST /certificates`): cria registro via Prisma, monta HTML com `TemplatesService`, gera PDF (`PdfService` ? Browserless) e envia para o Cloudinary. O `CertificateService` salva a URL retornada.
5. **Listagem** (`GET /certificates/my-certificates`): m?dicos podem paginar/filtrar por paciente, recebendo objetos com `pdfUrl`.
6. **Valida??o p?blica** (`GET /certificates/public/validate/:id`): retorna metadados do atestado para confer?ncia.

### Vari?veis de Ambiente Essenciais
- `DATABASE_URL`: string de conex?o do PostgreSQL.
- `JWT_SECRET`: chave usada no `AuthService` e `JwtModule`.
- `FRONTEND_URL`: dom?nio usado em CORS e links de valida??o.
- `PORT`: porta de execu??o (Render define automaticamente).
- `BROWSERLESS_API_KEY`: token do servi?o remoto para Puppeteer.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## Frontend (Next.js 14)

### Estrutura
- **App Router** em `src/app`: cada pasta representa uma rota (`dashboard`, `login`, `cadastro` etc.).
- **Componentes reutiliz?veis** em `src/components` (formul?rios, modais, sidebar).
- `src/services/api.ts`: inst?ncia do Axios com base URL definida em `NEXT_PUBLIC_API_URL`.
- **Middleware** (`src/middleware.ts`): protege rotas e redireciona conforme role do JWT.
- **Hooks e contextos** (`src/hooks`, `src/contexts`): gerenciamento de estado do formul?rio de atestado.

### Principais Telas/Fluxos
- **Login / Cadastro**: consomem os endpoints `/auth/login`, `/users`, `/patients`.
- **Dashboard do m?dico**:
  - `/dashboard`: dados gerais.
  - `/dashboard/atestados`: lista de hist?ricos.
  - `/dashboard/atestados/novo`: formul?rio de emiss?o via `CertificateForm`.
- **Dashboard do paciente**: `/paciente/dashboard` exibe atestados recebidos.
- **Valida??o p?blica**: `/validar/[codigo]` consome endpoint p?blico do backend.

### Vari?veis de Ambiente
- `NEXT_PUBLIC_API_URL`: URL p?blica do backend.

- `JWT_SECRET`: mesmo valor do backend (utilizado no middleware para valida??o local de cookies).

---

## Testes e Qualidade

### Backend
- `npm run lint`: aplica ESLint/Prettier.

- `npm run test`: executa specs (atualmente apenas testes b?sicos de instanciamento).  
  > Futuramente, podem ser expandidos com mocks do Prisma.

### Frontend
- `npm run lint`: aplica ESLint.

- `npm run build`: compila o Next.js, checa tipos e gera sa?da est?tica.

---

## Deploy e Opera??es

### Backend (Render)
1. Definir as vari?veis de ambiente mencionadas.

2. **Build**:
   ```bash
   npm install && npm run build
3. **Start**:
   ```bash
   npm run start:prod
---

### Frontend (Vercel)
---

1. Configurar `NEXT_PUBLIC_API_URL` e `JWT_SECRET` no dashboard da Vercel.

2. **Build padr?o**:
   ```bash
   npm install && npm run build
3. Garantir que a URL do backend publicado corresponde ? usada em CORS e no QRCode.
---

## Banco de Dados

### Migra??es
```bash
npx prisma migrate deploy
````

### Seed
Para popular dados de teste (apenas em ambientes de desenvolvimento/staging):

```bash
npm run prisma:seed
```