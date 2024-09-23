import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';

export function canSSRGuest<P extends { [key: string]: any }>(fn: GetServerSideProps<P>): GetServerSideProps<P> {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        // Verifica se o usuário já está logado
        if (cookies['@workflows.token']) {
            return {
                redirect: {
                    destination: '/home',
                    permanent: false,
                },
            };
        }        
        return await fn(ctx);
    };
}
