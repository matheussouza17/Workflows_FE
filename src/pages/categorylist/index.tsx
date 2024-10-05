import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import FilterAndActions from '../../components/FilterAndActions';
import DataTable from '../../components/DataTable';
import styles from './styles.module.scss';
import MainLayout from '../../components/MainLayout';

const CategoryList = () => {
  const { categories, fetchCategories, loading } = useContext(CategoryContext);
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

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' }
  ];

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Categories</title>
      </Head>
      <Header />
      <div className={styles.categoryListContainer}>
        <h1 className={styles.title}>Categories</h1>

        <FilterAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel="Create New Category"
          onButtonClick={() => router.push('/category/create')}
        />

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <DataTable
            data={filterCategories()}
            columns={columns}
            onRowClick={(category) => router.push(`/category/${category.id}`)}
            actionLabel="View Details"
            onActionClick={(category) => router.push(`/category/${category.id}`)}
          />
        )}
      </div>
    </>
    </MainLayout>
  );
};

// Protege a página para usuários logados
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default CategoryList;
