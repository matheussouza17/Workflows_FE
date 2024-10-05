import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import FilterAndActions from '../../components/FilterAndActions';
import DataTable from '../../components/DataTable';
import styles from './styles.module.scss';
import MainLayout from '../../components/MainLayout';

const ApprovalList = () => {
  const { approvals, fetchApprovals, loading } = useContext(ApprovalContext);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // Função para filtrar aprovações pelo nome ou número
  const filterApprovals = () => {
    if (!searchTerm) return approvals;
    return approvals.filter((approval) =>
      approval.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Definindo as colunas da tabela
  const columns = [
    { key: 'number', label: 'Número' },
    { key: 'name', label: 'Nome' },
    { key: 'categoryId', label: 'Categoria' },
    { key: 'value', label: 'Valor' }
  ];

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Aprovações</title>
      </Head>
      <Header />
      <div className={styles.approvalListContainer}>
        <h1 className={styles.title}>Aprovações</h1>

        <FilterAndActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel="Criar Nova Aprovação"
          onButtonClick={() => router.push('/approval/create')}
        />

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : approvals.length === 0 ? (
          <p>Nenhuma aprovação encontrada.</p>
        ) : (
          <DataTable
            data={filterApprovals()}
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
