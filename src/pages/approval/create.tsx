import { useState, useEffect, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { ApprovalContext } from '../../contexts/ApprovalContext';
import { CategoryContext } from '../../contexts/CategoryContext';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import styles from './create.module.scss';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';
import { toast } from 'react-toastify';

const CreateApproval = () => {
  const { createApproval, loading } = useContext(ApprovalContext);
  const { fetchCategories, categories } = useContext(CategoryContext);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [fetchCategories, categories.length]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!number || !name || !categoryId || value <= 0) {
      toast.warning('Please fill in all required fields');
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
      toast.success('Approval created successfully!');
      router.push('/approvallist');
    } catch (error) {
      console.error('Error creating approval:', error);
      toast.error('Error creating approval');
    }
  }

  return (
    <MainLayout>
      <>
        <Head>
          <title>Create Approval</title>
        </Head>
        <Header />
        <div className={styles.createApprovalContainer}>
          <h1 className={styles.title}>Create Approval</h1>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <Input
              type="text"
              placeholder="Approval Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            <Input
              type="text"
              placeholder="Approval Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="Value"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              required
            />
            <TextArea
              className={styles.textAreaLarge}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              {loading ? 'Creating...' : 'Create Approval'}
            </Button>
          </form>
        </div>
      </>
    </MainLayout>
  );
};

// Protects the page for authenticated users
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {},
  };
});

export default CreateApproval;