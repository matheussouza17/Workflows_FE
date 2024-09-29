import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DepartmentContext } from '../../../contexts/DepartmentContext';
import { Button } from '../../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../../components/Header';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import Head from 'next/head';
import { AuthContext } from '../../../contexts/AuthContext';

const Department = () => {
  const { department, fetchDepartmentById, loading } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext); // Verifica a role se necessário
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchDepartmentById(Number(id));
    }
  }, [id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!department) {
    return <p>Departamento não encontrado</p>;
  }

  return (
    <>
      <Head>
        <title>Workflows - Detalhes do Departamento</title>
      </Head>
      <Header />
      <div className={styles.departmentDetailContainer}>
        <h1>{department.name}</h1>
        <p><strong>Código:</strong> {department.code}</p>
        {department.description && <p><strong>Descrição:</strong> {department.description}</p>}
        <Button onClick={() => router.push('/departmentlist')}>
          Voltar para Lista
        </Button>
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

export default Department;
