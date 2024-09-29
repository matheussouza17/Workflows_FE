import Head from 'next/head';
import styles from './dashboard.module.scss';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <>
    <Header />
      <Head>
        <title>Workflows - Dashboard</title>
      </Head>
      <div className={styles.container}>
        <h1>Bem-vindo(a), {user?.name}</h1>

        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h2>Suas Aprovações</h2>
            <p>Aqui será mostrado um resumo das aprovações mais recentes.</p>
          </div>

          <div className={styles.infoCard}>
            <h2>Notificações</h2>
            <p>Aqui você verá notificações importantes sobre seus processos.</p>
          </div>

          <div className={styles.infoCard}>
            <h2>Última Atividade</h2>
            <p>Informações sobre suas últimas atividades e interações.</p>
          </div>
        </section>
      </div>
    </>
  );
}

// Protege a página, apenas users logados podem acessar
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  }
});