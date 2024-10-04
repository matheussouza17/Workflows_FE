import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DepartmentContext } from '../../contexts/DepartmentContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthContext';
import { FaPlus } from 'react-icons/fa'; // Biblioteca para ícones

const DepartmentList = () => {
  const { departments, fetchDepartments, loading } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
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

  return (
    <>
      <Head>
        <title>Workflows - Departments</title>
      </Head>
      <Header />
      <div className={styles.departmentListContainer}>
        <h1 className={styles.title}>Departments</h1>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Search by name"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Botão para criar novo departamento */}
        <div className={styles.createButtonContainer}>
          <Button
            className={styles.createButton}
            onClick={() => router.push('/department/create')}
          >
            <FaPlus className={styles.plusIcon} /> Create New Department
          </Button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <table className={styles.departmentTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterDepartments().map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.code}</td>
                  <td>
                    <Button
                      className={styles.actionButton}
                      onClick={() => router.push(`/department/${department.id}`)}
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

// Protege a página, apenas usuários logados podem acessar
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default DepartmentList;
