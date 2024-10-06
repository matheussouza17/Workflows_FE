import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import FilterAndActions from '../../components/FilterAndActions';
import DataTable from '../../components/DataTable';
import styles from './styles.module.scss';
import MainLayout from '../../components/MainLayout';

const ApprovalList = () => {
  const { approvals, fetchApprovals, loading } = useContext(ApprovalContext);
  const { categories, fetchCategories } = useContext(CategoryContext);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprovals();
    fetchCategories();
  }, []);

  // Função para filtrar aprovações pelo nome ou número
  const filterApprovals = () => {
    if (!searchTerm) return approvals;
    return approvals.filter((approval) =>
      approval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Função para obter o nome da categoria pelo ID
  const getCategoryNameById = (categoryId:number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Definindo as colunas da tabela
  const columns = [
    { key: 'number', label: 'Número' },
    { key: 'name', label: 'Nome' },
    { key: 'categoryName', label: 'Categoria' },
    { key: 'value', label: 'Valor' }
  ];

  // Mapeando dados para incluir o nome da categoria
  const dataWithCategoryNames = filterApprovals().map((approval) => ({
    ...approval,
    categoryName: getCategoryNameById(approval.categoryId)
  }));

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Approvals</title>
      </Head>
      <Header />
      <div className={styles.approvalListContainer}>
        <h1 className={styles.title}>Approvals</h1>

        <FilterAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel="Create New Approvals"
          onButtonClick={() => router.push('/approval/create')}
        />

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : approvals.length === 0 ? (
          <p>No approvals found.</p>
        ) : (
          <DataTable
            data={dataWithCategoryNames}
            columns={columns}
            onRowClick={(approval) => router.push(`/approval/${approval.id}`)}
            actionLabel="Ver Detalhes"
            onActionClick={(approval) => router.push(`/approval/${approval.id}`)}
          />
        )}
      </div>
    </>
    </MainLayout>
  );
};

// Protege a página para usuários autenticados
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {},
  };
});

export default ApprovalList;