import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './errors/AuthTokenError';
import { signOut } from '../contexts/AuthContext';

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Alterar para usar NEXT_PUBLIC_API_URL
  const api = axios.create({
    baseURL: apiUrl,  // Usa o valor correto da variável de ambiente
    headers: {
      Authorization: `Bearer ${cookies['@workflows.token']}` // Usa o token do cookie
    }
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Se estiver no lado do cliente, deslogar o usuário
        if (typeof window !== 'undefined') {
          signOut();
        } else {
          // No lado do servidor, lançar o erro de autenticação
          return Promise.reject(new AuthTokenError());
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
