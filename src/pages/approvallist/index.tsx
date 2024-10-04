import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import { FaPlus } from 'react-icons/fa';

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

  return (
    <>
      <Head>
        <title>Workflows - Aprovações</title>
      </Head>
      <Header />
      <div className={styles.approvalListContainer}>
        <h1 className={styles.title}>Aprovações</h1>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por nome ou número"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Botão para criar nova aprovação */}
        <div className={styles.createButtonContainer}>
          <Button
            className={styles.createButton}
            onClick={() => router.push('/approval/create')}
          >
            <FaPlus className={styles.plusIcon} /> Criar Nova Aprovação
          </Button>
        </div>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : approvals.length === 0 ? (
          <p>Nenhuma aprovação encontrada.</p>
        ) : (
          <table className={styles.approvalTable}>
            <thead>
              <tr>
                <th>Número</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filterApprovals().map((approval) => (
                <tr key={approval.id}>
                  <td>{approval.number}</td>
                  <td>{approval.name}</td>
                  <td>{approval.categoryId}</td>
                  <td>R$ {approval.value.toFixed(2)}</td>
                  <td>
                    <Button
                      onClick={() => router.push(`/approval/${approval.id}`)}
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

// Protege a página para usuários autenticados
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {},
  };
});

export default ApprovalList;
