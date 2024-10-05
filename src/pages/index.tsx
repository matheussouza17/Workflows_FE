import Head from 'next/head';
import Image from 'next/image';
import logoImg from '../../public/workflows-logo.png'; // Ajuste o caminho da logo se necessário
import styles from '../../styles/home.module.scss';
import { useContext, FormEvent, useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

import Link from 'next/link';
import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); // Impedir o recarregamento da página

    if (email === '' || password === '') {
      toast.warning('Preencha os dados!');
      return;
    }

    setLoading(true);

    let data = {
      email,
      password,
    };

    await signIn(data); // Chama a função signIn do AuthContext

    setLoading(false);
  }

  return (
    <MainLayout withSidebar={false}>
    <>
      <Head>
        <title>Workflows - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image
          src={logoImg}
          alt="Logo Workflows"
          width={400}
        />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type='submit'
              loading={loading}
            >
              Acessar
            </Button>
          </form>

          <Link href='/signup' className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </>
  </MainLayout>
  );
}

export const getServerSideProps = canSSRGuest(async () => {
  return {
    props: {}, 
  };
});
