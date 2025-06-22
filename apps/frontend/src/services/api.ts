// Endereço: apps/frontend/src/services/api.ts (VERSÃO CORRETA E FINAL)

import axios from 'axios';
import Cookies from 'js-cookie';

// Criamos a instância base do axios com a URL do nosso backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
});

// ==========================================================
// INTERCEPTOR DE REQUISIÇÃO
// Esta função é executada ANTES de cada requisição sair do front-end.
// É a forma correta de adicionar o token de autenticação.
// ==========================================================
api.interceptors.request.use(
  (config) => {
    // No momento exato da requisição, pegamos o token mais recente dos cookies
    const token = Cookies.get('zello.token');
    
    // Se o token existir, nós o adicionamos aos cabeçalhos (headers) da requisição
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Retornamos a configuração para que a requisição possa continuar
    return config;
  },
  (error) => {
    // Se houver um erro na configuração da requisição, ele é rejeitado
    return Promise.reject(error);
  }
);

// Exportamos a instância configurada para ser usada em toda a aplicação
export { api };