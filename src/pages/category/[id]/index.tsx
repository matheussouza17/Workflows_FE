import { useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../components/ui/Button';
import { Input,TextArea } from '../../../components/ui/Input';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { Header } from '../../../components/Header';
import { CategoryContext } from '../../../contexts/CategoryContext';
import MainLayout from '../../../components/MainLayout';
import { toast } from 'react-toastify';

const UpdateCategory = () => {
  const { fetchCategoryById, updateCategory } = useContext(CategoryContext);
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');

  // Fetch department details by ID once on component mount
  useEffect(() => {
    if (!router.isReady || !id || isNaN(Number(id))) return;

    const loadDepartment = async () => {
      setIsLoadingData(true);
      try {
        const categoryData = await fetchCategoryById(Number(id));
        if (categoryData) {
          setDescription(categoryData.description || '');
          setName(categoryData.name || '');
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDepartment();
  }, [router.isReady, id]);


  // Handle form submission for updating category
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (name === '') {
      toast.warning('Name are required');
      return;
    }

    setLoading(true);

    try {
      await updateCategory(Number(id), {
        description,
        name
      });
      toast.success('Category updated successfully!');
      router.push('/categorylist');
    } catch (error) {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <p>Loading category details...</p>;
  }

  return (
    <MainLayout>
      <>
        <Header />
        <div className={styles.createDepartmentContainer}>
          <h1 className={styles.title}>Update Category</h1>
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
              {loading ? 'Updating...' : 'Update category'}
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

export default UpdateCategory;
