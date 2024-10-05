import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import styles from './create.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import MainLayout from '../../components/MainLayout';

const CreateDepartment = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (code === '' || name === '') {
      alert('Code and name are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/department', {
        code,
        name,
        description
      });
      alert('Department created successfully!');
      router.push('/departmentlist');
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department');
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
    <>
      <Header />
      <div className={styles.createDepartmentContainer}>
        <h1 className={styles.title}>Create Department</h1>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <Input
            type="text"
            placeholder="Department Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextArea
            placeholder="Department Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={loading}>
            {loading ? 'Creating...' : 'Create Department'}
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
    props: {}
  }
});

export default CreateDepartment;
