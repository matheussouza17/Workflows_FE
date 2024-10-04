import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthContext';
import { FaPlus } from 'react-icons/fa'; // Biblioteca para ícones

const CategoryList = () => {
  const { categories, fetchCategories, loading } = useContext(CategoryContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const filterCategories = () => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <Head>
        <title>Workflows - Categories</title>
      </Head>
      <Header />
      <div className={styles.categoryListContainer}>
        <h1 className={styles.title}>Categories</h1>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Search by name"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Botão para criar nova categoria */}
        <div className={styles.createButtonContainer}>
          <Button
            className={styles.createButton}
            onClick={() => router.push('/category/create')}
          >
            <FaPlus className={styles.plusIcon} /> Create New Category
          </Button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <table className={styles.categoryTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterCategories().map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || 'No description'}</td>
                  <td>
                    <Button
                      className={styles.actionButton}
                      onClick={() => router.push(`/category/${category.id}`)}
                    >
                      View Details
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

// Protege a página para usuários logados
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default CategoryList;
