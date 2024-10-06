import { useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/Button';
import { Input, TextArea } from '../../../components/ui/Input';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { Header } from '../../../components/Header';
import { DepartmentContext } from '../../../contexts/DepartmentContext';
import MainLayout from '../../../components/MainLayout';

const UpdateDepartment = () => {
  const { fetchDepartmentById, updateDepartment } = useContext(DepartmentContext);
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch department details by ID
  useEffect(() => {
    if (!id || isNaN(Number(id))) return;

    let isMounted = true; // Para garantir que o componente está montado antes de setar estado

    async function loadDepartment() {
      setDepartmentLoading(true);
      try {
        const departmentData = await fetchDepartmentById(Number(id));
        if (departmentData && isMounted) {
          setCode(departmentData.code);
          setName(departmentData.name);
          setDescription(departmentData.description || '');
        }
      } catch (error) {
        console.error('Error fetching department:', error);
      } finally {
        if (isMounted) {
          setDepartmentLoading(false);
        }
      }
    }

    loadDepartment();

    return () => {
      isMounted = false; // Marca como desmontado para evitar atualização de estado
    };
  }, [id]);

  // Handle form submission for updating department
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (code === '' || name === '') {
      alert('Code and name are required');
      return;
    }

    setLoading(true);

    try {
      await updateDepartment(Number(id), {
        code,
        name,
        description,
      });
      alert('Department updated successfully!');
      router.push('/departmentlist');
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Failed to update department');
    } finally {
      setLoading(false);
    }
  }

  if (departmentLoading) {
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
            <TextArea
              placeholder="Department Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
