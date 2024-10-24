import { useState, useEffect, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../../services/apiClient';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import styles from './styles.module.scss'; // Assuming you have separate styles
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { UserContext } from '../../../contexts/UserContext';
import { DepartmentContext } from '../../../contexts/DepartmentContext';
import { toast } from 'react-toastify';
import { Header } from '../../../components/Header';
import Head from 'next/head';
import MainLayout from '../../../components/MainLayout';


const UserDetail = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO'>('Employee');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedInUserRole, setLoggedInUserRole] = useState<'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO' | null>(null);
  const router = useRouter();
  const { id } = router.query; 
  const { getUser, getUsers } = useContext(UserContext); 
  const { departments, fetchDepartments } = useContext(DepartmentContext);

  useEffect(() => {
    fetchDepartments();
    getUsers();
  }, [fetchDepartments, getUsers]);

  useEffect(() => {
    if (id) {
      const loadUserData = async () => {
        try {
          const response = await api.get(`/user/${id}`);
          const userData = response.data;
          setName(userData.name);
          setEmail(userData.email);
          setRole(userData.role);
          setDepartmentId(userData.departmentId);
        } catch (error) {
          console.error('Failed to load user data:', error);
          toast.error('Failed to load user data');
        }
      };
      loadUserData(); // Call the function expression
    }
  }, [id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (name === '' || email === '') {
      toast.warning('Name and email are required');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password); 
      formData.append('role', role);
      if (photo) formData.append('file', photo); 
      if (departmentId) formData.append('departmentId', departmentId.toString());

      await api.put(`/user/${id}`, formData);
      toast.success('User updated successfully!');
      router.push('/userslist'); 
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  }

  function renderDepartmentSelect() {
    if (loggedInUserRole === 'Accounting' || loggedInUserRole === 'CFO') {
      return (
        <Select
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(Number(e.target.value) || null)}
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
      );
    }
    return null;
  }

  return (
    <MainLayout>
    <>
      <Head>
        <title>Workflows - User Details</title>
      </Head>
      <Header />
    <div className={styles.editUserContainer}>
      <h1 className={styles.title}>Edit User</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <Input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="New Password (leave blank if unchanged)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as 'Employee' | 'Manager' | 'Director' | 'Accounting' | 'CFO')}
        >
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Director">Director</option>
          <option value="Accounting">Accounting</option>
          <option value="CFO">CFO</option>
        </Select>

        {renderDepartmentSelect()}

        <Input
          type="file"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        />

        <Button type="submit" loading={loading}>
          {loading ? 'Updating...' : 'Update User'}
        </Button>
      </form>
    </div>
    </>
    </MainLayout>
);
};

// Protect the page for authenticated users
export const getServerSideProps = canSSRAuth(async () => {
  return {
    props: {},
  };
});

export default UserDetail;
