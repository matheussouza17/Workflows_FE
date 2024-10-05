import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CategoryContext } from '../../../contexts/CategoryContext';
import { Button } from '../../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../../components/Header';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../../contexts/AuthContext';
import MainLayout from '../../../components/MainLayout';

const Category = () => {
  const { category, fetchCategoryById, loading } = useContext(CategoryContext);
  const { user } = useContext(AuthContext); // Aqui você pode verificar a role, se necessário
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchCategoryById(Number(id));
    }
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!category) {
    return <p>Categoria não encontrada</p>;
  }

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Detalhes da Categoria</title>
      </Head>
      <Header />
      <div className={styles.categoryDetailContainer}>
        <h1>{category.name}</h1>
        {category.description && (
          <p>
            <strong>Descrição:</strong> {category.description}
          </p>
        )}
        <Button onClick={() => router.push('/categorylist')}>Voltar para Lista</Button>
      </div>
    </>
    </MainLayout>
  );
};

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default Category;
