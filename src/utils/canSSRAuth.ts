import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

// Função para páginas que só users logados podem ter acesso.
export function canSSRAuth<P extends { [key: string]: any }>(fn: GetServerSideProps<P>): GetServerSideProps<P> {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies['@workflows.token']; // Ajustado para o projeto Workflows

    // Verifica se o token existe. Caso contrário, redireciona para a página de login
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      // Se houver um token válido, chama a função passada
      return await fn(ctx);
    } catch (err) {
      // Se o erro for um problema com o token, destrói o cookie e redireciona para a página de login
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@workflows.token'); // Destruir o cookie se houver erro de autenticação

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      } else {
        // Caso contrário, retorna uma página 404
        return {
          notFound: true,
        };
      }
    }
  };
}
