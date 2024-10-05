import { useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../services/apiClient';
import { Button } from '../../../components/ui/Button';
import { Input, TextArea } from '../../../components/ui/Input';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { Header } from '../../../components/Header';
import { DepartmentContext } from '../../../contexts/DepartmentContext';
import MainLayout from '../../../components/MainLayout';

const UpdateDepartment = () => {
  const { department, fetchDepartmentById, updateDepartment } = useContext(DepartmentContext);
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Para indicar o carregamento inicial dos dados
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch department details by ID
  useEffect(() => {
    async function loadDepartment() {
      if (id && !isNaN(Number(id))) {
        try {
          await fetchDepartmentById(Number(id)); // Aguarda o fetch dos dados
          if (department) {
            setCode(department.code);
            setName(department.name);
            setDescription(department.description || '');
          }
        } catch (error) {
          console.error('Error fetching department:', error);
        } finally {
          setInitialLoading(false); // O carregamento inicial é finalizado
        }
      }
    }
    loadDepartment();
  }, [id, fetchDepartmentById]);

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

  if (initialLoading) {
    return <p>Loading department details...</p>; // Exibe enquanto carrega os dados iniciais
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
    props: {}
  };
});

export default UpdateDepartment;
