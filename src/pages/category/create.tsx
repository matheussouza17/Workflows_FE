import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import styles from './create.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import MainLayout from '../../components/MainLayout';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (name === '') {
      alert('O nome da categoria é obrigatório');
      return;
    }

    setLoading(true);

    try {
      await api.post('/category', {
        name,
      });
      alert('Categoria criada com sucesso!');
      router.push('/categorylist');
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      alert('Falha ao criar categoria');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
    <>
      <Header />
      <div className={styles.createCategoryContainer}>
        <h1 className={styles.title}>Criar Categoria</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <Input
            type="text"
            placeholder="Nome da Categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" loading={loading}>
            {loading ? 'Criando...' : 'Criar Categoria'}
          </Button>
        </form>
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

export default CreateCategory;
