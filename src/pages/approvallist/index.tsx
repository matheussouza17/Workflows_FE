import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { Button } from '../../components/ui/Button';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';

const ApprovalList = () => {
  const { approvals, fetchApprovals, loading } = useContext(ApprovalContext);
  const router = useRouter();

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <>
      <Head>
        <title>Workflows - Aprovações</title>
      </Head>
      <Header />
      <div className={styles.approvalListContainer}>
        <h1>Aprovações</h1>
        {loading ? (
          <p>Carregando...</p>
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
              {approvals.map((approval) => (
                <tr key={approval.id}>
                  <td>{approval.number}</td>
                  <td>{approval.name}</td>
                  <td>{approval.categoryId}</td>
                  <td>{approval.value.toFixed(2)}</td>
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

// Protege a página, apenas users logados podem acessar
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {}
  };
});

export default ApprovalList;
