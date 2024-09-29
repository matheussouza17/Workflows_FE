import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../../contexts/ApprovalContext';
import { Button } from '../../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../../components/Header';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import Head from 'next/head';

const ApprovalDetail = () => {
  const { approval, process, processLogs, loading, fetchApprovalById, fetchProcessLogs, handleAction } = useContext(ApprovalContext);
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('details'); // Estado para controlar as abas

  useEffect(() => {
    if (id) {
      fetchApprovalById(Number(id));
    }
  }, [id]);

  useEffect(() => {
    if (process?.id) {
      fetchProcessLogs(process.id); // Buscar o histórico com base no processId
    }
  }, [process?.id]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!approval) {
    return <p>Aprovação não encontrada</p>;
  }

  return (
    <>
      <Head>
        <title>Workflows - Detalhes da Aprovação</title>
      </Head>
      <Header />
      <div className={styles.approvalDetailContainer}>
        <div className={styles.tabContainer}>
          {/* Tabs para alternar entre Detalhes e Histórico */}
          <button
            onClick={() => setActiveTab('details')}
            className={activeTab === 'details' ? styles.activeTab : ''}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? styles.activeTab : ''}
          >
            Histórico
          </button>
        </div>

        {activeTab === 'details' ? (
          <>
            <h1 className={styles.heading}>Detalhes da Aprovação</h1>
            <p><strong>Número:</strong> {approval.number}</p>
            <p><strong>Nome:</strong> {approval.name}</p>
            <p><strong>Categoria:</strong> {approval.categoryId}</p>
            <p><strong>Valor:</strong> R$ {approval.value.toFixed(2)}</p>
            <p><strong>Descrição:</strong> {approval.description || 'Sem descrição'}</p>

            <div className={styles.actionButtons}>
              {process && process.status === 'Pending' && (
                <>
                  <Button onClick={() => handleAction('Approved', process.id)}>Aprovar</Button>
                  <Button onClick={() => handleAction('Rejected', process.id)}>Reprovar</Button>
                  <Button onClick={() => handleAction('Cancelled', process.id)}>Cancelar</Button>
                </>
              )}

              {process && process.status === 'InProgress' && (
                <>
                  <Button onClick={() => handleAction('Approved', process.id)}>Aprovar</Button>
                  <Button onClick={() => handleAction('Rejected', process.id)}>Reprovar</Button>
                </>
              )}

              {process && process.status === 'Completed' && (
                <p>Este processo já foi concluído.</p>
              )}

              {process && process.status === 'Cancelled' && (
                <p>Este processo foi cancelado.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Histórico da Aprovação</h1>
            {processLogs.length > 0 ? (
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Usuário</th>
                    <th>Data</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {processLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>{log.user?.name || 'Usuário não encontrado'}</td> 
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhum histórico encontrado.</p>
            )}
          </>
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

export default ApprovalDetail;
