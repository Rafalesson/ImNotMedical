# 📋 Guia de Configuração do .env - Backend ImNotMedical

## ✅ Resumo Executivo

O arquivo `.env` foi criado em `apps/backend/.env`. Este arquivo contém todas as variáveis de ambiente necessárias para executar o backend localmente.

---

## 🗂️ Estrutura do Arquivo .env

O arquivo está dividido em 6 seções principais:

### 1️⃣ DATABASE CONFIGURATION
```
DATABASE_URL="postgresql://admin:mysecretpassword@localhost:5499/telemedicine"
```
- **Descrição**: String de conexão do PostgreSQL
- **Valor Atual**: Configurado para conectar ao banco Docker (porta 5499)
- **Quando mudar**: Se você usar um banco diferente
- **Formato**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

**Pré-requisito**: O banco de dados deve estar rodando. Execute:
```bash
docker compose up -d
```

---

### 2️⃣ JWT AUTHENTICATION
```
JWT_SECRET="seu_jwt_secret_super_seguro_aqui_min_32_chars"
```
- **Descrição**: Chave para assinar tokens JWT de autenticação
- **Crítico**: Esta é uma variável **OBRIGATÓRIA** (o backend falha sem ela)
- **Recomendação**: Use uma string aleatória com pelo menos 32 caracteres
- **Como gerar** (no terminal):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Exemplo de valor seguro**:
  ```
  JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0"
  ```

---

### 3️⃣ SERVER CONFIGURATION

#### PORT
```
PORT=3333
```
- **Descrição**: Porta onde o backend será executado
- **Padrão**: 3333
- **Nota**: O `main.ts` usa 3333 como fallback se não definir

#### NODE_ENV
```
NODE_ENV=development
```
- **Descrição**: Ambiente de execução
- **Valores**: `development`, `production`, `test`
- **Comportamento**:
  - `development`: Mais logs, CORS permissivo
  - `production`: CORS restritivo, logs minimizados

#### FRONTEND_URL
```
FRONTEND_URL="http://localhost:3001"
```
- **Descrição**: URL do frontend para CORS
- **Necessário se**: O frontend não está na whitelist padrão
- **Whitelist padrão** (já incluída):
  - `http://localhost:3001`
  - `http://192.168.0.2:3001`
  - `http://172.20.80.1:3001`

---

### 4️⃣ CLOUDINARY (Upload de Imagens)
```
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```
- **O que é**: Serviço de hospedagem de imagens em nuvem
- **Necessário para**: Upload de fotos de perfil, certificados, etc.
- **Onde obter**:
  1. Acesse https://cloudinary.com
  2. Criar conta gratuita
  3. Copiar credenciais do dashboard
- **Sem configurar**: O upload de imagens falhará

---

### 5️⃣ PDF GENERATION

#### CHROME_EXECUTABLE_PATH
```
CHROME_EXECUTABLE_PATH=""
```
- **O que é**: Caminho do executável do Chrome/Chromium
- **Deixar vazio**: O Puppeteer usa seu próprio Chromium
- **Quando usar**: Se você tiver Chrome/Chromium instalado e quer usar ele
- **Exemplo de valor**:
  ```
  CHROME_EXECUTABLE_PATH="/usr/bin/chromium-browser"  # Linux
  CHROME_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"  # macOS
  CHROME_EXECUTABLE_PATH="C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"  # Windows
  ```

#### BROWSERLESS_API_KEY
```
BROWSERLESS_API_KEY=""
```
- **O que é**: Alternativa para geração de PDFs usando API externa
- **Para deixar vazio**: Use Puppeteer local
- **Quando usar**: Em produção ou se Puppeteer tiver problemas
- **Onde obter**: https://www.browserless.io

---

### 6️⃣ EMAIL SERVICE

#### Configuração Atual
```
# Ethereal (teste - comentado)
```
- **Status**: Configurado para criar conta de teste automaticamente
- **Arquivo responsável**: [src/mail/mail.service.ts](../apps/backend/src/mail/mail.service.ts)

#### Para Produção
Descomente e configure:
```
SMTP_HOST="seu_host_smtp"
SMTP_PORT=587
SMTP_USER="seu_usuario"
SMTP_PASSWORD="sua_senha"
```

**Opções comuns**:
- **Gmail**: smtp.gmail.com (porta 587)
- **SendGrid**: smtp.sendgrid.net (porta 587)
- **AWS SES**: email-smtp.[region].amazonaws.com (porta 587)

---

## 🚀 Passos para Configurar Localmente

### 1. **Banco de Dados** ✅ (já pronto)
```bash
# Inicie o PostgreSQL via Docker
docker compose up -d

# Verifique se está rodando
docker compose ps
```

### 2. **JWT_SECRET** ⚠️ (OBRIGATÓRIO)
```bash
# Gere uma chave segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copie o resultado e adicione ao .env:
JWT_SECRET="[cole_aqui_o_resultado]"
```

### 3. **Cloudinary** (Opcional, mas recomendado)
```
1. Acesse https://cloudinary.com
2. Crie uma conta gratuita
3. Vá para Settings → API Keys
4. Copie: Cloud Name, API Key, API Secret
5. Atualize o .env
```

### 4. **Inicie o Backend**
```bash
cd apps/backend

# Instale dependências (se não fez ainda)
npm install

# Execute em modo desenvolvimento
npm run start:dev
```

Você deverá ver:
```
[Nest] 12345   - 02/02/2026, 10:30:00     LOG [NestFactory] Starting Nest application...
...
Server is listening on port 3333
```

---

## ✨ Variáveis Obrigatórias vs Opcionais

### 🔴 OBRIGATÓRIAS (backend não funciona sem)
- `DATABASE_URL` - conexão com banco
- `JWT_SECRET` - autenticação JWT

### 🟡 RECOMENDADAS (funcionalidades principais)
- `CLOUDINARY_*` - upload de imagens
- `FRONTEND_URL` - CORS correto

### 🟢 OPCIONAIS (features extras)
- `BROWSERLESS_API_KEY` - geração de PDF via API
- `CHROME_EXECUTABLE_PATH` - customizar Chrome
- `SMTP_*` - email em produção

---

## 🔐 Segurança

### ⚠️ NUNCA faça isso:
- ❌ Commit do `.env` no git
- ❌ Colocar credenciais reais em exemplo
- ❌ Compartilhar `JWT_SECRET` em público

### ✅ Boas práticas:
- ✔️ Use `.gitignore` para `.env` (já deve estar configurado)
- ✔️ Crie `.env.example` com placeholder
- ✔️ Use chaves fortes (32+ caracteres)
- ✔️ Gire chaves regularmente em produção

---

## 🧪 Testando a Configuração

```bash
cd apps/backend

# Teste se consegue compilar
npm run build

# Teste a conexão com BD
npm run start:dev

# Você deverá ver:
# "Server is listening on port 3333"
```

---

## 🐛 Troubleshooting

### "JWT_SECRET não configurado"
```
✓ Adicione ao .env: JWT_SECRET="sua_chave_aqui"
```

### "Erro de conexão com banco"
```
✓ Verifique se Docker está rodando: docker compose ps
✓ Verifique DATABASE_URL está correto
✓ Teste: psql postgresql://admin:mysecretpassword@localhost:5499/telemedicine
```

### "CORS bloqueado"
```
✓ Adicione FRONTEND_URL no .env com o URL correto
✓ OU deixe NODE_ENV=development (mais permissivo)
```

### "Upload de imagem falha"
```
✓ Configure CLOUDINARY_* (obtenha em cloudinary.com)
✓ OU implemente alternativa local no código
```

---

## 📚 Referências

- [Documentação NestJS Config](https://docs.nestjs.com/techniques/configuration)
- [Prisma Database URL](https://www.prisma.io/docs/reference/database-reference/connection-urls/postgresql)
- [JWT.io](https://jwt.io)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**Status**: ✅ Arquivo `.env` criado com sucesso!
**Próxima ação**: Configure o `JWT_SECRET` com uma chave forte.
