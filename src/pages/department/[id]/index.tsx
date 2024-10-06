import { useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { Header } from '../../../components/Header';
import { DepartmentContext } from '../../../contexts/DepartmentContext';
import { UserContext } from '../../../contexts/UserContext';
import MainLayout from '../../../components/MainLayout';
import { toast } from 'react-toastify';

const UpdateDepartment = () => {
  const { fetchDepartmentById, updateDepartment } = useContext(DepartmentContext);
  const { getUsers, users } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [approvalDirectorId, setApprovalDirectorId] = useState<string | null>(null);

  // Fetch department details by ID once on component mount
  useEffect(() => {
    if (!router.isReady || !id || isNaN(Number(id))) return;

    const loadDepartment = async () => {
      setIsLoadingData(true);
      try {
        const departmentData = await fetchDepartmentById(Number(id));
        if (departmentData) {
          setCode(departmentData.code || '');
          setName(departmentData.name || '');
          setApprovalDirectorId(departmentData.approvalDirectorId || null);
        }
      } catch (error) {
        console.error('Error fetching department:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDepartment();
  }, [router.isReady, id]);

  // Fetch users for approvalDirector dropdown once
  useEffect(() => {
    if (users.length === 0) {
      getUsers(); // Deve trazer somente diretores disponíveis
    }
  }, [getUsers, users.length]);

  // Handle form submission for updating department
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (code === '' || name === '') {
      toast.warning('Code and name are required');
      return;
    }

    setLoading(true);

    try {
      await updateDepartment(Number(id), {
        code,
        name,
        approvalDirectorId: approvalDirectorId || null,
      });
      toast.success('Department updated successfully!');
      router.push('/departmentlist');
    } catch (error) {
      toast.error('Failed to update department');
      console.error('Error updating department:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <p>Loading department details...</p>;
  }

  return (
    <MainLayout>
      <>
        <Header />
        <div className={styles.createDepartmentContainer}>
          <h1 className={styles.title}>Update Department</h1>
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
              {loading ? 'Updating...' : 'Update Department'}
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

export default UpdateDepartment;
