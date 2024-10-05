import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DepartmentContext } from '../../contexts/DepartmentContext';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import FilterAndActions from '../../components/FilterAndActions';
import DataTable from '../../components/DataTable';
import styles from './styles.module.scss';
import MainLayout from '../../components/MainLayout';

const DepartmentList = () => {
  const { departments, fetchDepartments, loading } = useContext(DepartmentContext);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filterDepartments = () => {
    if (!searchTerm) return departments;
    return departments.filter((department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' }
  ];

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Departments</title>
      </Head>
      <Header />
      <div className={styles.departmentListContainer}>
        <h1 className={styles.title}>Departments</h1>

        <FilterAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel="Create New Department"
          onButtonClick={() => router.push('/department/create')}
        />

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <DataTable
            data={filterDepartments()}
            columns={columns}
            onRowClick={(department) => router.push(`/department/${department.id}`)}
            actionLabel="View Details"
            onActionClick={(department) => router.push(`/department/${department.id}`)}
          />
        )}
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

export default DepartmentList;
