import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DepartmentContext } from '../../contexts/DepartmentContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../contexts/AuthContext';

const DepartmentList = () => {
  const { departments, fetchDepartments, loading } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext); // Verifica a role se necessário
  const router = useRouter();

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      <Head>
        <title>Workflows - Departamentos</title>
      </Head>
      <Header />
      <div className={styles.departmentListContainer}>
        <h1>Departamentos</h1>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className={styles.departmentTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{department.name}</td>
                  <td>{department.code}</td>
                  <td>
                    <Button
                      onClick={() => router.push(`/department/${department.id}`)}
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

// Protege a página, apenas usuários logados podem acessar
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default DepartmentList;
