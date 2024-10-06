import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import styles from './create.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import MainLayout from '../../components/MainLayout';
import { toast } from 'react-toastify';

const CreateCategory = () => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (name === '') {
      toast.warning('Name are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/category', {
        description,
        name,
      });
      toast.success('Category created successfully!');
      router.push('/categorylist');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <>
        <Header />
        <div className={styles.createDepartmentContainer}>
          <h1 className={styles.title}>Create Category</h1>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <Input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextArea
              placeholder="Category Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              {loading ? 'Creating...' : 'Create category'}
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
