import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthContext';

const CategoryList = () => {
  const { categories, fetchCategories, loading } = useContext(CategoryContext);
  const { user } = useContext(AuthContext); // Aqui você pode verificar a role, se necessário
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Head>
        <title>Workflows - Categorias</title>
      </Head>
      <Header />
      <div className={styles.categoryListContainer}>
        <h1>Categorias</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    <Button
                      onClick={() => router.push(`/category/${category.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default CategoryList;
