// src/services/api.ts (versão com variável de ambiente)
import axios from 'axios';

export const api = axios.create({
  // Lê o endereço do nosso arquivo .env.local
  // Se a variável não existir, ele usa um valor padrão (bom para segurança)
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333',
});