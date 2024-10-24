import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../../contexts/ApprovalContext';
import { Button } from '../../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../../components/Header';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import Head from 'next/head';
import MainLayout from '../../../components/MainLayout';

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
    return <p>Loading...</p>;
  }

  if (!approval) {
    return <p>Approval not found.</p>;
  }

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - Approval Details</title>
      </Head>
      <Header />
      <div className={styles.approvalDetailContainer}>
        <div className={styles.tabContainer}>
          {/* Tabs para alternar entre Detalhes e Histórico */}
          <button
            onClick={() => setActiveTab('details')}
            className={activeTab === 'details' ? styles.activeTab : ''}
            >
            Datails
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={activeTab === 'history' ? styles.activeTab : ''}
            >
            History
          </button>
        </div>

        {activeTab === 'details' ? (
          <>
            <h1 className={styles.heading}>Approval Details</h1>
            <p><strong>Number:</strong> {approval.number}</p>
            <p><strong>Name:</strong> {approval.name}</p>
            <p><strong>Category:</strong> {approval.categoryId}</p>
            <p><strong>Value:</strong> R$ {approval.value.toFixed(2)}</p>
            <p><strong>Description:</strong> {approval.description || 'No Description'}</p>

            <div className={styles.actionButtons}>
              {process && process.status === 'Pending' && (
                <>
                  <Button onClick={() => handleAction('Approved', process.id)}>Approve</Button>
                  <Button onClick={() => handleAction('Rejected', process.id)} className={styles.rejectButton}>Reject</Button>
                  <Button onClick={() => handleAction('Cancelled', process.id)} className={styles.cancelButton}>Cancel Approval</Button>
                </>
              )}

              {process && process.status === 'InProgress' && (
                <>
                  <Button onClick={() => handleAction('Approved', process.id)}>Approve</Button>
                  <Button onClick={() => handleAction('Rejected', process.id)} className={styles.rejectButton}>Reject</Button>
                </>
              )}

              {process && process.status === 'Completed' && (
                <p>This process has now been completed.</p>
              )}

              {process && process.status === 'Cancelled' && (
                <p>This process has been cancelled.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.heading}>Approval History</h1>
            {processLogs.length > 0 ? (
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {processLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.action}</td>
                      <td>{log.user?.name || 'User not found'}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td>{log.description || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No history found.</p>
            )}
          </>
        )}
      </div>
    </>
  </MainLayout>
  );
};

// Protege a página, apenas usuários logados podem acessar
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default ApprovalDetail;