import { useState, useEffect, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import styles from './create.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/Header';
import MainLayout from '../../components/MainLayout';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';

const CreateDepartment = () => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [approvalDirectorId, setApprovalDirectorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { getUsers, users } = useContext(UserContext);

  useEffect(() => {
    // Carregar usuários para a lista de diretores de aprovação
    if (users.length === 0) {
      getUsers(); // Deve trazer somente diretores disponíveis
    }
  }, [getUsers, users.length]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (code === '' || name === '') {
      toast.warning('Code and name are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/department', {
        code,
        name,
        approvalDirectorId: approvalDirectorId || null,
      });
      toast.success('Department created successfully!');
      router.push('/departmentlist');
    } catch (error) {
      console.error('Error creating department:', error);
      toast.error('Failed to create department');
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
            <Select
              value={approvalDirectorId || ''}
              onChange={(e) => setApprovalDirectorId(e.target.value || null)}
            >
              <option value="">Select Approval Director (Optional)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Select>
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
    props: {},
  };
});

export default CreateDepartment;
