import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../contexts/UserContext';
import { DepartmentContext } from '../../contexts/DepartmentContext';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import FilterAndActions from '../../components/FilterAndActions';
import DataTable from '../../components/DataTable';
import styles from './styles.module.scss';
import MainLayout from '../../components/MainLayout';

const UserList = () => {
  const { usersAll, getAllUsers } = useContext(UserContext);
  const { departments, fetchDepartments } = useContext(DepartmentContext);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Buscar usuários e departamentos quando o componente for montado
  useEffect(() => {
    async function fetchData() {
      await Promise.all([getAllUsers(), fetchDepartments()]);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Cria um mapa de departmentId para departmentName
  const departmentMap = departments.reduce((acc, dept) => {
    acc[dept.id] = dept.name;
    return acc;
  }, {} as { [key: number]: string });

  // Função para filtrar os usuários com base no termo de pesquisa e adicionar departmentName
  const filterUsers = () => {
    console.log(usersAll); // Verifica se os usuários estão sendo retornados corretamente
    if (!usersAll || usersAll.length === 0) {
      return []; // Retorna uma lista vazia enquanto os dados são carregados
    }
    let filtered = usersAll;
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered.map((user) => ({
      ...user,
      departmentName: departmentMap[user.departmentId || 0] || 'N/A',
    }));
  };

  // Definindo as colunas para a tabela
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'departmentName', label: 'Department' }, // Atualizado para 'departmentName'
  ];

  // Exibe o carregamento enquanto os dados estão sendo obtidos
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <>
        <Head>
          <title>Workflows - Users</title>
        </Head>
        <Header />
        <div className={styles.departmentListContainer}>
          <h1 className={styles.title}>Users</h1>

          {/* Componente de filtro e ações */}
          <FilterAndActions
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            buttonLabel="Create New User"
            onButtonClick={() => router.push('/user/create')}
          />

          {/* Tabela de dados */}
          <DataTable
            data={filterUsers()} // Passa os usuários filtrados para a tabela
            columns={columns}
            onRowClick={(user) => router.push(`/user/${user.id}`)} // Atualizando para usar "user" ao invés de "department"
            actionLabel="View Details"
            onActionClick={(user) => router.push(`/user/${user.id}`)} // Atualizando para usar "user" ao invés de "department"
          />
        </div>
      </>
    </MainLayout>
  );
};

// Função para autenticação no SSR
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default UserList;
