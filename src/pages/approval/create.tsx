import { useState, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import styles from './create.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';

const CreateApproval = () => {
  const { createApproval, loading } = useContext(ApprovalContext);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!number || !name || !categoryId || value <= 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await createApproval({
        number,
        name,
        categoryId: Number(categoryId),
        value: Number(value),
        description,
      });
      router.push('/approvallist'); // Redireciona após criação
    } catch (error) {
      console.error('Erro ao criar aprovação:', error);
    }
  }

  return (
    <>
      <Head>
        <title>Criar Aprovação</title>
      </Head>
      <Header />
      <div className={styles.createApprovalContainer}>
        <h1 className={styles.title}>Criar Aprovação</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <Input
            type="text"
            placeholder="Número da Aprovação"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Nome da Aprovação"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Categoria ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Valor"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
          <TextArea
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={loading}>
            {loading ? 'Criando...' : 'Criar Aprovação'}
          </Button>
        </form>
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

export default CreateApproval;
